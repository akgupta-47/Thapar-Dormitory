const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Every user should enter their name'],
  },
  displayPicture: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Every user should enter their email address'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Every user should enter their password'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
