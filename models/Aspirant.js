const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const aspirantSchema = new Schema({
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
  state: {
    type: String,
    default: "Bayelsa",
  },
  lga: {
    type: String,
    default: "Southern Ijaw",
  },
});

const Aspirant = mongoose.model("Aspirant", aspirantSchema);

const validateAspirant = (aspirant) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
    category: Joi.string().min(6).max(255).required(),
    state: Joi.string().min(3).max(50),
    lga: Joi.string().min(3).max(50),
  });

  return schema.validate(aspirant);
};

exports.Aspirant = Aspirant;
exports.validateAspirant = validateAspirant;
