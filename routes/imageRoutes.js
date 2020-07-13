const express = require("express");
const { getGfs } = require("../config/db");
const router = express.Router();
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const { uploadImage } = require("../middleware/fileUpload");

router.post(
  "/userimage/upload",
  [auth, uploadImage.single("image")],
  async (req, res) => {
    try {
      let user = await User.findById(req.user.id).select("-password");
      if (user.displayPicture && user.displayPicture.charAt(0) === "/") {
        getGfs().remove(
          { filename: user.displayPicture.split("/")[4], root: "images" },
          (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err });
            }
          }
        );
      }
      if (!req.file) {
        user.displayPicture =
          "https://www.tenforums.com/geek/gars/images/2/types/thumb__ser.png";
        await user.save();
      } else {
        user.displayPicture = `/api/image/display/${req.file.filename}`;
        await user.save();
      }
      res.send(user);
    } catch (e) {
      console.log(e);
      return res.status(400).send("server error");
    }
  }
);

router.get("/display/:filename", (req, res) => {
  getGfs().files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length == 0) {
      return res.status(404).json({
        err: "No file exists!",
      });
    }
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/jpg" ||
      file.contentType === "image/gif"
    ) {
      const readstream = getGfs().createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(400).json({
        err: "Not an image!",
      });
    }
  });
});

module.exports = router;
