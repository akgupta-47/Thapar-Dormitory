const mongoose = require("mongoose");

const laundrySchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  laundryNumber: {
    type: String,
    required: true,
  },
  studentPhone: {
    type: Number,
    required: true,
  },
  entry_date: {
    type: Date,
    default: Date.now,
    required: [true, "Every receipt should have an entry date"],
  },
  due_date: {
    type: Date,
    //required: [true, 'Every receipt should have a due date'],
  },
  clothesAmount: {
    type: Number,
    default: 0,
    required: [true, "Every receipt should have a clothes amount"],
  },
  torn: {
    type: Number,
    default: 0
  },
  laundryWorkerStatus: {
    type: Boolean,
    default: false,
  },
  studentStatus: {
    type: Boolean,
    default: false,
  },
  clothes:[{
    clothType: String,
    amount:{
      type: Number,
      default:0
    }
  }]
});

const Laundry = mongoose.model("Laundry", laundrySchema);

module.exports = Laundry;
