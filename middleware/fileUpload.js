const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const { DB } = require("../config/db");
const crypto = require("crypto");
const path = require("path");

const storage = new GridFsStorage({
    url: DB,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename =
            buf.toString("hex") + path.extname(file.originalname);
          let bucketName;
          if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/gif")  
            bucketName = "images";
          else
            bucketName = "otherFiles";
          const fileInfo = {
            filename: filename,
            bucketName,
          };
          resolve(fileInfo);
        });
      });
    },
  });

const upload = multer({storage})

module.exports =  upload;
