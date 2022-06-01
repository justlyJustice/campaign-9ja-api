const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    maxlength: 255,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
