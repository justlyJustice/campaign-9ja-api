const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlueprintSchema = new Schema(
  {
    desc: {
      type: String,
      min: 3,
      required: true,
    },
    image: {
      type: String,
    },
    aspirantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aspirant",
    },
  },
  { timestamps: true }
);

const Blueprint = mongoose.model("Blueprint", BlueprintSchema);

exports.Blueprint = Blueprint;
