const express = require('express');
const { check, validationResult } = require('express-validator');
const postController = require('../controllers/postControler');
const router = express.Router();
const auth = require('../middleware/auth');

router
  .route('/')
  .get(auth, postController.getAllPosts)
  .post(
    [
      auth,
      check('title', 'You must provide a title (i.e. Hostel Title etc.)!')
        .not()
        .isEmpty()
        .trim(),
      check('description', 'You must provide the information about your post!')
        .not()
        .isEmpty()
        .trim(),
    ],
    postController.createPost
  );

module.exports = router;
