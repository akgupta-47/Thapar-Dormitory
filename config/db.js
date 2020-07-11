const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

let gfs;

const connectDB = async()=>{
    try{
        const connectionReturns = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        })
        console.log('DB connection successful still');
    }catch(e){
        return console.log(e);
    }
}

module.exports = connectDB;