const express = require('express');
const postController = require('../controllers/postControler');
const router = express.Router();

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

module.exports = router;
