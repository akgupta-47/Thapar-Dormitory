const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messMenuSchema = new Schema({
    hostel:{
        type:String,
        required:true
    },
    messMenu:String,
    uploader:{
        type: Schema.Types.ObjectId,
        ref:'Users'
    }
})

const MessMenu = mongoose.model('messmenu',messMenuSchema);
module.exports = MessMenu;
