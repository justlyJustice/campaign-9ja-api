const express = require("express");
const router = express.Router();
const { verifyEmail, verified, getPresidentialCandidates, getGovernorshipCandidates } = require("../controllers/users");

router.route("/users/verify/:id/:uniqueString").post(verifyEmail);
router.route("/users/verified").get(verified);
router.route('/presidential-candidates').get(getPresidentialCandidates);
router.route('/governorship-candidates').get(getGovernorshipCandidates)

module.exports = router;
