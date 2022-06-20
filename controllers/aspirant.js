const { Aspirant } = require("../models/Aspirant");
const { Profile } = require("../models/Profile");
const { Agenda } = require("../models/Agenda");
const { Blueprint } = require("../models/Blueprint");
const { Quote } = require("../models/Quote");
const { SocialResponsibility } = require("../models/SocialResponsibility");
const { PreviousAchievements } = require("../models/PreviousAchievements");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");
const multer = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const multerUploads = multer.multerUploads;
const cloudinaryConfig = cloudinary.cloudinaryConfig;
const datauri = multer.datauri;
const asyncWrapper = require("../middlewares/async");

// @desc    Upload aspirant avatar
// @route   PUT /api/aspirant/:id/update-account
// @access  PRIVATE
exports.updateAccount = asyncWrapper(async (req, res) => {
  const file = datauri(req);

  cloudinary.uploader.upload(file.content, async (err, result) => {
    if (err) throw err;

    let aspirant = await Aspirant.findById(req.params.id);
    if (!aspirant)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Aspirant not found!" });

    if (aspirant.email !== req.user.email) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access denied! Not your profile" });
    }

    aspirant = await Aspirant.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: result.secure_url,
          currentPosition: req.body.currentPosition,
          contestingFor: req.body.contestingFor,
          contestingParty: req.body.contestingParty,
        },
      },
      { new: true }
    );

    await aspirant.save();

    res.status(StatusCodes.CREATED).json({
      aspirant: _.pick(aspirant, [
        "_id",
        "name",
        "category",
        "state",
        "lga",
        "avatar",
        "currentPosition",
        "contestingFor",
        "contestingParty",
      ]),
    });
  });
});

// @desc    Add aspirant quotes
// @route   PUT /api/aspirant/:id/add-social-responsibility
// @access  PRIVATE
exports.addSocialResponsibility = asyncWrapper(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid ID",
    });

  const aspirant = await Aspirant.findById(req.params.id);
  if (!aspirant)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Aspirant not found!" });

  if (aspirant.email !== req.user.email) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access denied! Not your profile" });
  }

  const socResponse = new SocialResponsibility({
    desc: req.body.desc,
    aspirantId: req.params.id,
  });

  await socResponse.save();

  aspirant.socialResponsibilities.push(socResponse);
  await aspirant.save();

  res.status(StatusCodes.CREATED).json({ socResponse });
});

// @desc    Add aspirant quotes
// @route   PUT /api/aspirant/:id/add-quotes
// @access  PRIVATE
exports.addQuote = asyncWrapper(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid ID",
    });

  const aspirant = await Aspirant.findById(req.params.id);
  if (!aspirant)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Aspirant not found!" });

  if (aspirant.email !== req.user.email) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access denied! Not your profile" });
  }

  const quote = new Quote({
    desc: req.body.desc,
    aspirantId: req.params.id,
  });

  await quote.save();

  aspirant.quotes.push(quote);
  await aspirant.save();

  res.status(StatusCodes.CREATED).json({ quote });
});

// @desc    Add aspirant blueprint
// @route   PUT /api/aspirant/:id/add-blueprint
// @access  PRIVATE
exports.addBlueprint = asyncWrapper(async (req, res) => {
  const file = datauri(req);

  cloudinary.uploader.upload(file.content, async (err, result) => {
    if (err) throw err;

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid ID",
      });

    let aspirant = await Aspirant.findById(req.params.id);
    if (!aspirant)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Aspirant not found!" });

    if (aspirant.email !== req.user.email) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Access denied! Not your profile" });
    }

    const blueprint = await Blueprint({
      desc: req.body.desc,
      image: result.secure_url,
      aspirantId: req.params.id,
    });

    await blueprint.save();

    aspirant.blueprints.push(blueprint);
    await aspirant.save();

    res.status(StatusCodes.CREATED).json({ blueprint });
  });
});

// @desc    Add aspirant agenda
// @route   PUT /api/aspirant/:id/add-agenda
// @access  PRIVATE
exports.addAgenda = asyncWrapper(async (req, res) => {
  const aspirant = await Aspirant.findById(req.params.id);
  if (!aspirant)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Aspirant not found!" });

  if (aspirant.email !== req.user.email) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access denied! Not your profile" });
  }

  const agenda = new Agenda({
    title: req.body.title,
    desc: req.body.desc,
    aspirantId: req.params.id,
  });

  await agenda.save();

  aspirant.agendas.push(agenda);
  await aspirant.save();

  res.status(StatusCodes.CREATED).json({ agenda });
});

// @desc    Add aspirant profile
// @route   PUT /api/aspirant/:id/add-profile
// @access  PRIVATE
exports.addProfile = asyncWrapper(async (req, res) => {
  const aspirant = await Aspirant.findById(req.params.id);
  if (!aspirant)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Aspirant not found!" });

  if (aspirant.email !== req.user.email) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access denied! Not your profile" });
  }

  const profile = new Profile({
    biography: req.body.biography,
    family: req.body.family,
    academicBackground: req.body.academicBackground,
    aspirantId: req.params.id,
  });

  await profile.save();

  aspirant.profile = Object.assign(profile);
  await aspirant.save();

  res.status(StatusCodes.CREATED).json({ profile });
});

// @desc    Add aspirant previous-achievements
// @route   DELETE /api/aspirant/aspirant-id/profile/previous-achievements
// @access  PRIVATE
exports.addPreviousAchievements = asyncWrapper(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid ID",
    });

  const profile = await Profile.findOne({ id: req.user.id });
  if (!profile)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Profile not found" });

  const preAchieve = await PreviousAchievements({
    title: req.body.title,
    desc: req.body.desc,
    profileId: req.params.id,
  });

  await preAchieve.save();
  profile.previousAchievements.push(preAchieve);

  await profile.save();
  res.status(StatusCodes.CREATED).json({ preAchieve });
});

// @desc    Delete aspirant profile
// @route   DELETE /api/aspirant/aspirant-id
// @access  PRIVATE
exports.deleteProfile = asyncWrapper(async (req, res) => {
  const aspirant = await Aspirant.findByIdAndRemove(req.params.id);
  if (!aspirant)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Aspirant not found" });

  res.status(StatusCodes.OK).json({ aspirant });
});
