const Profile = require("../models/profileModel");
const Post = require("../models/postModel");
const { validationResult } = require("express-validator");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  const { description, title, tag } = req.body;
  let post = {};
  post.description = description;
  if (title) post.title = title.trim();
  if (tag) {
    let trimmedTag = tag.trim();
    post.tag =
      trimmedTag.slice(0, 1).toUpperCase() +
      trimmedTag.slice(1, trimmedTag.length).toLowerCase();
  }
  post.user = req.user.id;
  try {
    const { hostel } = await Profile.findOne({ user: req.user.id });
    post.hostel = hostel;
    const newPost = await Post(post).save();
    res.status(201).json({
      status: "success",
      data: {
        post: newPost,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
