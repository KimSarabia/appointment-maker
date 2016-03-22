'use strict';

var express = require('express');
var router = express.Router();
var moment = require('moment');

var Appointment = require('../models/appointment');

router.get('/', function(req, res, next) {
  Appointment.find({}, function(err, appointments) {
    if(err) return res.status(400).send(err);
    res.send(appointments);
  });
});

// all appointments between an hour ago and end of day
// that are not checked in
router.get('/upcoming', function(req, res) {
  var anHourAgo = moment().subtract(1, 'hour').toDate();
  var endOfToday = moment().endOf('day').toDate();

  Appointment.find({
      time: {
        '$gte': anHourAgo,
        '$lte': endOfToday
      },
      checkedIn: false
    }, function(err, appointments) {
      if(err) return res.status(400).send(err);
      res.send(appointments);
    });
})

router.get('/today', function(req, res, next) {
  var startOfToday = moment().startOf('day').toDate();
  var endOfToday = moment().endOf('day').toDate();

  Appointment.find({time: {'$gte': startOfToday, '$lte': endOfToday }}, function(err, appointments) {
    if(err) return res.status(400).send(err);
    res.send(appointments);
  });
});

router.post('/', function(req, res) {
  var appointment = new Appointment(req.body);
  appointment.save(function(err, savedAppointment) {
    res.status(err ? 400 : 200).send(err || savedAppointment);
  });
});

// toggle checkin
router.put('/:id/checkin', function(req, res) {
  Appointment.findById(req.params.id, function(err, appointment) {
    if(err) return res.status(400).send(err);
    appointment.checkedIn = !appointment.checkedIn;
    appointment.save(function(err, savedAppointment) {
      res.status(err ? 400 : 200).send(err || savedAppointment);
    });
  });
});

// general update
router.put('/:id', function(req, res) {
  Appointment.findByIdAndUpdate(req.params.id,
    { $set: req.body },
    { new: true },
    function(err, appointment) {
      res.status(err ? 400 : 200).send(err || appointment);
    });
});

module.exports = router;
