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
    minlength: 1,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
  },
});

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;
