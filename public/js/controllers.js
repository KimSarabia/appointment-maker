'use strict';

var app = angular.module('AppointmentApp');

app.controller('homeCtrl', function($scope, AppointmentService) {
  console.log('home');

  AppointmentService.getUpcoming()
  .then(function(res){
    $scope.appointments = res.data;

  }, function(err){
    console.error('err:',err);
  });
});
