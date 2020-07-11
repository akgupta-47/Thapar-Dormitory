const express = require('express');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const { DB, getGfs } = require('../config/db');
const crypto = require('crypto');
const router = require('./userRoutes');
const path = require('path');

const storage = new GridFsStorage({
    url: DB,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'images'
          };
          resolve(fileInfo);
        });
      });
    }
});
const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req,res)=>{
    console.log('done');
})

router.get('/display/:filename',(req,res)=>{
    getGfs().files.findOne({filename: req.params.filename}, (err, file)=>{
        //Check if file
        if(!file || file.length==0)
        {
            return res.status(404).json({
                err: 'No file exists!'
            });
        }
        //Check if image
        if(file.contentType === 'image/jpeg'|| file.contentType === 'image/png')
        {
            //Read output to browser
            const readstream = getGfs().createReadStream(file.filename);
            readstream.pipe(res);
        }        
        else
        {
            res.status(400).json({
                err:'Not an image!'
            });
        }
    })
})

module.exports = router;