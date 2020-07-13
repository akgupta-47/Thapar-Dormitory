const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const { DB } = require("../config/db");
const crypto = require("crypto");
const path = require("path");

function storage(bucketName) {
  return new GridFsStorage({
    url: DB,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename =
            buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName,
          };
          resolve(fileInfo);
        });
      });
    },
  });
}

const uploadImage = multer({ storage: storage("images") });
const uploadFile = multer({ storage: storage("otherFiles") });

module.exports = { uploadImage, uploadFile };
