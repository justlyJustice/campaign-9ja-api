const { User, validate } = require("../models/User");
const { Aspirant, validateAspirant } = require("../models/Aspirant");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middlewares/async");
const {
  sendVerificationEmail,
  sendResetEmail,
} = require("../utils/nodemailer");

// @desc      User registration
// @route     /api/register
// @access    PUBLIC
exports.registerUser = asyncWrapper(async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "User already exists" });

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // sendVerificationEmail(user, res);

  res.status(StatusCodes.CREATED).json({
    status: "SUCCESS",
    message: "Account registered! Proceed to login",
    user: _.pick(user, ["_id", "name", "email", "isVerified"]),
  });
});

// @desc      Aspirant registration
// @route     /api/register-aspirant
// @access    PUBLIC
exports.registerAspirant = asyncWrapper(async (req, res) => {
  const { error } = validateAspirant(req.body);
  if (error)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: error.details[0].message });

  let aspirant = await Aspirant.findOne({ email: req.body.email });
  if (aspirant)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "User already exists" });

  aspirant = new Aspirant({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    category: req.body.category,
    state: req.body.state,
    lga: req.body.lga,
  });

  const salt = await bcrypt.genSalt(10);
  aspirant.password = await bcrypt.hash(aspirant.password, salt);

  await aspirant.save();

  // sendVerificationEmail(user, res);

  res.status(StatusCodes.CREATED).json({
    status: "SUCCESS",
    message: "Account registered! Proceed to login",
    aspirant: _.pick(aspirant, [
      "_id",
      "name",
      "email",
      "category",
      "state",
      "lga",
    ]),
  });
});

// @desc      User login
// @route     /api/login
// @access    PUBLIC
exports.loginUser = asyncWrapper(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "Incorrect username or password" });

  // if (!user.isVerified)
  //   return res.status(StatusCodes.BAD_REQUEST).json({
  //     status: "ERROR",
  //     message: "Account hasn't been verified! Check your inbox",
  //   });

  const password = await bcrypt.compare(req.body.password, user.password);
  if (!password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "Incorrect username or password" });

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET
  );

  res.header("x-auth-token", token).json({
    status: "SUCCESS",
    message: `Logged in as ${user.name}`,
    user: _.pick(user, ["_id", "name", "email", "isVerified"]),
  });
});

// @desc      Aspirant login
// @route     /api/login-aspirant
// @access    PUBLIC
exports.loginAspirant = asyncWrapper(async (req, res) => {
  const aspirant = await Aspirant.findOne({ email: req.body.email });
  if (!aspirant)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "Incorrect username or password" });

  // if (!user.isVerified)
  //   return res.status(StatusCodes.BAD_REQUEST).json({
  //     status: "ERROR",
  //     message: "Account hasn't been verified! Check your inbox",
  //   });

  const password = await bcrypt.compare(req.body.password, aspirant.password);
  if (!password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "Incorrect username or password" });

  const token = jwt.sign(
    { _id: aspirant._id, email: aspirant.email },
    process.env.JWT_SECRET
  );

  res.header("x-auth-token", token).json({
    status: "SUCCESS",
    message: `Logged in as ${aspirant.name}`,
    user: _.pick(aspirant, ["_id", "name", "email", "isVerified"]),
  });
});

// @desc      User password-reset request
// @route     /api/request-password-reset
// @access    PUBLIC
exports.requestPasswordReset = async (req, res) => {
  const { email, redirectURL } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "ERROR", message: "Invalid user" });

  sendResetEmail(user, redirectURL, res);
  res.status(StatusCodes.OK).json({
    status: "PENDING",
    message: "Password reset link has been sent to your email",
  });
};

// @desc      Reset user password
// @route     /api/reset-password
// @access    PUBLIC
exports.resetPassword = async (req, res) => {
  const { userId, resetString, newPassword } = req.body;

  const passwordReset = await PasswordReset.findOne({ userId });
  if (!passwordReset)
    return res.status(StatusCodes.NOT_FOUND).json({
      status: "ERROR",
      message: `No reset password reset for user: ${userId}`,
    });

  const { expiresAt } = passwordReset;
  const hashedResetString = passwordReset.resetString;

  if (expiresAt < Date.now()) {
    await PasswordReset.deleteOne({ userId });
    console.log("Reset link has expired!");
  }

  const validResetString = await bcrypt.compare(resetString, hashedResetString);
  if (!validResetString)
    return res
      .status(Statuscodes.BAD_REQUEST)
      .json({ status: "ERROR", message: "Invalid reset string" });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(newPassword, salt);

  const user = await User.findByIdAndUpdate(
    req.body.userId,
    {
      $set: {
        password,
      },
    },
    { new: true }
  );

  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ status: "SUCCESS", message: "Your password has been reset" });
};
