const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
