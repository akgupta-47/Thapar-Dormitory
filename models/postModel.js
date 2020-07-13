const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  title: {
    type: String,
  },
  image: {
    type: [String],
    default: undefined,
  },
  description: {
    type: String,
    required: [true, "Every post should have a description"],
  },
  fileAttached: {
    type: [String],
    default: undefined,
  },
  tag: {
    type: String,
    default: "Student",
  },
  hostel: {
    type: String,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
