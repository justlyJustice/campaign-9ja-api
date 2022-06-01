const express = require("express");
const router = express.Router();
const multer = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const multerUploads = multer.multerUploads;
const cloudinaryConfig = cloudinary.cloudinaryConfig;
const { deleteProfile, uploadAvatar } = require("../controllers/aspirant");
const { ensureToken } = require("../middlewares/auth");

/* Upload aspirant avatar */ router.put(
  "/:id",
  ensureToken,
  multerUploads.single("file"),
  cloudinaryConfig,
  uploadAvatar
);
/* Delete aspirant profile */ router.delete("/:id", deleteProfile);

module.exports = router;
