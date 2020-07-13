const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  role: {
    type: String,
    required: true,
  },
  hostel: {
    type: String,
    required: true,
  },
  roomInfo: {
    type: String,
  },
  laundryNumber: {
    type: String,
    unique: true,
  },
  rollNumber: {
    type: Number,
    unique: true,
    minlength: 9,
    maxlength: 9
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
    minlength:10,
    maxlength: 10
  }
});

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;
