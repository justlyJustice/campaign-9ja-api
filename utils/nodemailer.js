const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const { UserVerification } = require("../models/UserVerification");
const { PasswordReset } = require("../models/PasswordReset");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Nodemailer ready for messages", success);
  }
});

const sendVerificationEmail = async ({ _id, email }, res) => {
  const currentURL = "http://localhost:3000/api/";
  const uniqueString = uuid() + _id;

  const mailOptions = {
    to: email,
    from: process.env.AUTH_GMAIL,
    subject: "Verify Your Email",
    html: `<p>Click the below link to verify your account before login</p><p>This link <b>expires in 6 hours</b>.</p><p><a href=${
      currentURL + "user/verify/" + _id + "/" + uniqueString
    }>Verification link</a></p>`,
  };

  const salt = await bcrypt.genSalt(10);
  const hashedUniqueString = await bcrypt.hash(uniqueString, salt);

  const userVerification = new UserVerification({
    userId: _id,
    uniqueString: hashedUniqueString,
  });

  await userVerification.save();
  transporter.sendMail(mailOptions);
};

const sendResetEmail = async ({ _id, email }, redirectURL, res) => {
  const resetString = uuid() + _id;

  let passwordReset = await PasswordReset.findOne({ userId: _id });
  if (passwordReset) await PasswordReset.deleteMany({ passwordReset });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Please Reset Your Password",
    html: `<p>We heard you lost your password!</p><p>Don't worry. Follow the below link to provide a new password</p><p><a href=${
      redirectURL + "/" + _id + "/" + resetString
    }>Click link to reset password</a></p>`,
  };

  const salt = await bcrypt.genSalt(10);
  const hashedResetString = await bcrypt.hash(resetString, salt);

  const newPasswordReset = new PasswordReset({
    userId: _id,
    resetString: hashedResetString,
  });

  await newPasswordReset.save();
  transporter.sendMail(mailOptions);
};

exports.sendVerificationEmail = sendVerificationEmail;
exports.sendResetEmail = sendResetEmail;
