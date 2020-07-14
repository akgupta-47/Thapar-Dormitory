const mongoose = require('mongoose');

const laundrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  laundryNumber: {
    type: String,
  },
  enrty_date: {
    type: Date,
    default: Date.now,
    required: [true, 'Every receipt should have a entry date'],
  },
  due_date: {
    type: Date,
    required: [true, 'Every receipt should have a due date'],
  },
  clothesAmount: {
    type: Number,
    default: 0,
    required: [true, 'Every receipt should have a clothes amount'],
  },
  torn: {
    type: Number,
    default: 0,
    required: [true, 'Every receipt should have a torn message'],
  },
  problemsUser: {
    type: String,
  },
});

const Laundry = mongoose.model('Laundry', laundrySchema);

module.exports = Laundry;
