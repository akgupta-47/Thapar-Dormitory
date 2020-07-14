const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Grid = require('gridfs-stream');

dotenv.config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

let gis = {};
let gfs = {};

const connectDB = async () => {
  try {
    const connectionReturns = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    gis = Grid(connectionReturns.connections[0].db, mongoose.mongo);
    gis.collection('images');
    gfs = Grid(connectionReturns.connections[0].db, mongoose.mongo);
    gfs.collection('otherFiles');
    console.log('DB connection successful still');
  } catch (e) {
    return console.log(e);
  }
};

connectDB();

const getGis = () => {
  return gis;
};
const getGfs = () => {
  return gfs;
};

module.exports = {
  getGfs,
  getGis,
  DB,
};
