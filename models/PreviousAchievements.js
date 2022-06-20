const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreviousAchievementsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true }
);

const PreviousAchievemnets = mongoose.model(
  "PreviousAchievements",
  PreviousAchievementsSchema
);

exports.PreviousAchievements = PreviousAchievemnets;
