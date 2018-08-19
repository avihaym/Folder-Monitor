'use strict';
angular.module('app').factory('authService', function ($http, myConfig) {
  var service = {};
  service.Login = function (formData, callback) {
    $http.post(myConfig.server + '/auth/login', formData)
    .then(function successCallback(res) {
      callback (res.data);
    });
  };

  return service;
});
