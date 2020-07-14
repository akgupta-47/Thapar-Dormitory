const Profile = require("../models/profileModel");
const Post = require("../models/postModel");
const {getGfs,getGis} = require('../config/db');

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
  if(req.body) req.body = JSON.parse(JSON.stringify(req.body));
  if (req.files) 
  {
    req.files = JSON.parse(JSON.stringify(req.files));
    if(req.files.image) var image = [`/api/image/display/${req.files.image[0].filename}`];
    if(req.files.file) var fileAttached = [`/posts/file/${req.files.file[0].filename}`];
  }
  if((!req.body) || (!req.body.description) || (req.body.description.trim().length===0))
  { 
    if(req.files && req.files.image)
      getGis().remove(
        { filename: req.files.image[0].filename, root: "images" },
        (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err });
          }
        }
      );
    if(req.files && req.files.file)
      getGfs().remove(
        { filename: req.files.file[0].filename, root: "otherFiles" },
        (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err });
          }
        }
      );
    return res.status(400).json({errors:'You must provide a description for the post!'})
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
  if(image.length!==0) post.image = image;
  if(fileAttached.length!==0) post.fileAttached = fileAttached;
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
