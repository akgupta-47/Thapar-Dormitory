const express = require("express");
const postController = require("../controllers/postControler");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/fileUpload");
const {getGfs} = require('../config/db');

router
  .route("/")
  .get(auth, postController.getAllPosts)
  .post(
    [
      auth,
      upload.fields([
        { name: "file", maxCount: 1 },
        { name: "image", maxCount: 1 },
      ]),
    ],
    postController.createPost
  );

router.get("/file/:filename", (req, res) => {
  getGfs().files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length == 0) {
      return res.status(404).json({
        err: "No file exists!",
      });
    }
    const readstream = getGfs().createReadStream(file.filename);
    readstream.pipe(res);
  });
});

module.exports = router;
