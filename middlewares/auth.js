const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

exports.ensureToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Oops! You're not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid token" });
  }
};
