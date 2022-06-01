const express = require("express");
const router = express.Router();
const {
  verifyEmail,
  verified,
  getPresidentialCandidates,
  getGovernorshipCandidates,
} = require("../controllers/users");
const { ensureToken } = require("../middlewares/auth");

/* Verify user account */ router
  .route("/users/verify/:id/:uniqueString")
  .post(verifyEmail);
/* Display verified page */ router.route("/users/verified").get(verified);
/* Get all presidential candidates */ router
  .route("/presidential-candidates")
  .get(ensureToken, getPresidentialCandidates);
/* Get all governorship candidates */ router
  .route("/governorship-candidates")
  .get(ensureToken, getGovernorshipCandidates);

module.exports = router;
