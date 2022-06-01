const { Aspirant } = require("../models/Aspirant");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");
const multer = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const multerUploads = multer.multerUploads;
const cloudinaryConfig = cloudinary.cloudinaryConfig;
const datauri = multer.datauri;
const asyncWrapper = require("../middlewares/async");

// @desc    Upload aspirant avatar
// @route   PUT /api/aspirant/aspirant-id
// @access  PRIVATE
exports.uploadAvatar = asyncWrapper(async (req, res) => {
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
      ]),
    });
  });
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
