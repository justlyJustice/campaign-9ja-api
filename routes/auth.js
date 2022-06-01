const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerAspirant,
  loginAspirant,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth");

/* Register user */ router.post("/register", registerUser);
/* Login user */ router.post("/login", loginUser);
/* Register aspirant */ router.post("/register-aspirant", registerAspirant);
/* Login aspirant */ router.post("/login-aspirant", loginAspirant)
/* Request password resest */ router.post("/request-password-reset", requestPasswordReset);
/* Reset password */ router.post("/reset-password", resetPassword);

module.exports = router;
