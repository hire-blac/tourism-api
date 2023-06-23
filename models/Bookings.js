const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Activity = require('./activity');

const bookingSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: User
  },
  activity: {
    type: mongoose.Types.ObjectId,
    ref: Activity
  },
  numOfAdults: {
    type: Number,
    required: true,
    default: 1,
  },
  numOfChildren: {
    type: Number,
    required: true,
    default: 0,
  },
  amountPaid: {
    type: Number,
    required: true
  },
  date: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  time: {
    type: String
  }
}, {timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;