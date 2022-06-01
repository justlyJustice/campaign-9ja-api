const { User } = require("../models/User");
const { Comment } = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");

// @desc        Add comments to candidates portfolio
// @route       /api/:userId/comments
// @access      Private
exports.addComment = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "ERROR", message: "User does not exist" });

  const comment = new Comment({
    message: req.body.message,
  });

  comment.postedBy.unshift(req.user.id);

  await comment.save();

  await user.save();

  res
    .status(StatusCodes.CREATED)
    .json({ status: "SUCCESS", message: "Comment posted!" });
};
