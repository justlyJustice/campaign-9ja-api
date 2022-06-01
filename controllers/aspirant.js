const { Aspirant, validateAspirant } = require("../models/Aspirant");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const multerUploads = multer.multerUploads;
const cloudinaryConfig = cloudinary.cloudinaryConfig;
const datauri = multer.datauri;
const asyncWrapper = require("../middlewares/async");
const {
  sendVerificationEmail,
  sendResetEmail,
} = require("../utils/nodemailer");

exports.uploadProfile = asyncWrapper(async (req, res) => {
    const file = datauri(req);

    cloudinary.uploader.upload(file.content, async (err, result) => {
      if (err) throw err;

      const post = new Post({
        avatar: result.secure_url
      });

      const postTitle = await Post.findOne({ title: req.body.title });
      if (postTitle)
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Post already created!" });

      await post.save();

      res.status(StatusCodes.CREATED).json({ post });
});
