'use strict';

var mongoose = require('mongoose');

var Appointment = mongoose.model('Appointment', {
  time: Date,
  name: String,
  createdAt: { type: Date, default: Date.now },
  checkedIn: { type: Boolean, default: false }
});

module.exports = Appointment;
