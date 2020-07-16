const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  role: {
    type: String,
    required: [true, 'Every profile should contain users role'],
    default: 'Student',
  },
  hostel: {
    type: String,
    required: [true, 'Every profile should contain users Hostel'],
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
    maxlength: 9,
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Every profile should contain users Contact info'],
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  seenPosts:[mongoose.Schema.Types.ObjectId]
});

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;
