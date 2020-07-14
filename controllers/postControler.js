const Profile = require("../models/profileModel");
const Post = require("../models/postModel");
const {getGfs,getGis} = require('../config/db');

exports.getAllPosts = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({user:req.user.id});
    const posts = await Post.find({hostel:userProfile.hostel, tag:userProfile.role});
    if(posts.length === 0)
      return res.json({status: "fail", message: 'No posts to show!'})
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
  if (req.files) req.files = JSON.parse(JSON.stringify(req.files));
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
  if(req.files.image) post.image = [`/api/image/display/${req.files.image[0].filename}`];
  if(req.files.file)  post.fileAttached = [`/posts/file/${req.files.file[0].filename}`];
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
