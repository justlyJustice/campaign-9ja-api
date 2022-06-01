const mongoose = require("mongoose");

const userVerificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  uniqueString: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 21600000,
  },
});

const UserVerification = mongoose.model(
  "UserVerification",
  userVerificationSchema
);

exports.UserVerification = UserVerification;

//  OR 3600000
