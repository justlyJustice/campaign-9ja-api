const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  resetString: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 3600000,
  },
});

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

exports.PasswordReset = PasswordReset;
