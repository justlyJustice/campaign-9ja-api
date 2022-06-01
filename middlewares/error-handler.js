const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ status: "ERROR", message: "Something went wrong" });
};

module.exports = errorHandlerMiddleware;
