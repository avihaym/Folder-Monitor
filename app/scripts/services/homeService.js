'use strict';
angular.module('app').factory('homeService', function ($http, myConfig) {
  var service = {};

  service.startMonitor = function (folder, callback) {
   $http.post(myConfig.server + '/monitor/start', {folder: folder})
   .then(function (res) {
       callback(res.data);
   })
  };

  service.stopMonitor = function (callback) {
   $http.post(myConfig.server + '/monitor/stop')
   .then(function (res) {
       callback(res.data);
   })
  };

  service.getLogs = function (callback) {
   $http.get(myConfig.server + '/monitor/status')
   .then(function (res) {
       callback(res.data);
   })
  };

  return service;
 });
