const bcrypt = require("bcrypt");
const { UserVerification } = require("../models/UserVerification");
const { Aspirant } = require("../models/Aspirant");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/async");

// @DESC      Verify user email
// @ROUTE
// @ACCESS    Public
exports.verifyEmail = async (req, res) => {
  const { userId, uniqueString } = req.params;

  const user = await UserVerification.findOne({ userId });
  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "ERROR", message: "Invalid user" });

  const { expiresAt } = user;
  const hashedUniqueString = user.uniqueString;

  if (expiresAt < Date.now()) {
    await UserVerification.findByIdAndRemove(userId);
    await User.findByIdAndRemove({ _id: userId });
  }

  const validUniqueString = await bcrypt.compare(
    uniqueString,
    hashedUniqueString
  );
  if (!validUniqueString)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "Invalid verification link" });

  await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: {
        isVerified: true,
      },
    },
    { new: true }
  );

  await UserVerification.findByIdAndRemove(userId);
  res.redirect("/api/user/verified");
};

// @DESC      Rendering the success-page on email verification
// @ROUTE
// @ACCESS    Public
exports.verified = async (req, res) => {
  res.render("main");
};

// @DESC      Get presidential candidates
// @ROUTE     /presidential-candidates
// @ACCESS    Private
exports.getPresidentialCandidates = async (req, res) => {
  const aspirants = await Aspirant.find({ category: 'presidential-candidate'});
  if (!aspirants)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No presidential candidate yet" });

  res.status(StatusCodes.OK).json({ aspirants });
};

// @DESC      Get governorship candidates
// @ROUTE     /governorship-candidates
// @ACCESS    Private
exports.getGovernorshipCandidates = async (req, res) => {
  const aspirants = await Aspirant.find({
    category: "governorship-candidate",
  });
  if (!aspirants)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No governorship candidate yet" });

  res.status(StatusCodes.OK).json({ aspirants });
};
