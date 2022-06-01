const { StatusCodes } = require("http-status-codes");

const notFound = (req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ status: "ERROR", message: "Route not found!" });
  next();
};

module.exports = notFound;
