const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const aspirantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    category: {
      type: String,
      enum: ["presidential-candidate", "governorship-candidate"],
      required: true,
    },
    governorshipState: {
      type: String,
    },
    state: {
      type: String,
      default: null,
    },
    lga: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
    },
    currentPosition: {
      type: String,
    },
    contestingFor: {
      type: String,
    },
    contestingParty: {
      type: String,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    agendas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agenda",
      },
    ],
    blueprints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blueprint",
      },
    ],
    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
      },
    ],
    socialResponsibilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialResponsibility",
      },
    ],
  },
  { timestamps: true }
);

const Aspirant = mongoose.model("Aspirant", aspirantSchema);

const validateAspirant = (aspirant) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
    category: Joi.string().min(6).max(255).required(),
    state: Joi.string().min(3).max(50),
    lga: Joi.string().min(3).max(50),
    avatar: Joi.string().min(3).max(255),
  });

  return schema.validate(aspirant);
};

exports.Aspirant = Aspirant;
exports.validateAspirant = validateAspirant;
