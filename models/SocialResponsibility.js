const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SocialResponsibilitySchema = new Schema(
  {
    desc: {
      type: String,
      required: true,
      min: 3,
    },
  },
  { timestamps: true }
);

const SocialResponsibility = mongoose.model(
  "SocialResponsibility",
  SocialResponsibilitySchema
);

exports.SocialResponsibility = SocialResponsibility;
