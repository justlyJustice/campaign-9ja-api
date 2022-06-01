const express = require("express");
const router = express.Router();
const { ensureToken } = require("../middlewares/auth");
const { addComment } = require("../controllers/comments");

router.post("/", ensureToken, addComment);

module.exports = router;
