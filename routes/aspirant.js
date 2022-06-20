const express = require("express");
const router = express.Router();
const multer = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const multerUploads = multer.multerUploads;
const cloudinaryConfig = cloudinary.cloudinaryConfig;
const {
  deleteProfile,
  addProfile,
  updateAccount,
  addAgenda,
  addBlueprint,
  addQuote,
  addSocialResponsibility,
  addPreviousAchievements,
} = require("../controllers/aspirant");
const { ensureToken } = require("../middlewares/auth");

/* Upload aspirant avatar */ router.put(
  "/update-account/:id",
  ensureToken,
  multerUploads.single("file"),
  cloudinaryConfig,
  updateAccount
);
/* Add aspirant profile */ router.post(
  "/add-profile/:id",
  ensureToken,
  addProfile
);
/* Add aspirant agendas */ router.post(
  "/add-agenda/:id",
  ensureToken,
  addAgenda
);
/* Add aspirant blueprints */ router.post(
  "/add-blueprint/:id",
  ensureToken,
  multerUploads.single("file"),
  cloudinaryConfig,
  addBlueprint
);
/* Add aspirant quotes */ router.post("/add-quotes/:id", ensureToken, addQuote);
/* Add social responsibilities */ router.post(
  "/add-social-responsibility/:id",
  ensureToken,
  addSocialResponsibility
);
/* Add aspirant achievements */ router.post(
  "/add-previous-achievements/:id",
  ensureToken,
  addPreviousAchievements
);
/* Delete aspirant profile */ router.delete("/:id", deleteProfile);

module.exports = router;
