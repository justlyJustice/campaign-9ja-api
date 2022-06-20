const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    biography: {
      type: String,
    },
    family: {
      type: String,
    },
    academicBackground: {
      type: String,
    },
    previousAchievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PreviousAchievements",
      },
    ],
    aspirantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aspirant",
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);

exports.Profile = Profile;
