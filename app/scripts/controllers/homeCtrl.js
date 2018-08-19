'use strict';
angular.module('app')
.controller('homeCtrl', function($scope, homeService, $interval) {
  $scope.listening = false;
  $scope.folders = ["folder1"];

  var intervalCancel = "";
  $scope.folder = $scope.folders[0];

  $scope.start = function(){
    if(!$scope.folder){
      $scope.error = "Please enter folder path";
    } else {
      $scope.stop();
      homeService.startMonitor($scope.folder, function(res){
        if (res.status === "success"){
          $scope.error = "";
          $scope.listening = true;
          getLogs();
        } else {
          $scope.error = "Error: " + res.msg;
        }
      });
    }
  };

  $scope.stop = function(){
    if (intervalCancel){
      $interval.cancel(intervalCancel);
      intervalCancel = "";
      homeService.stopMonitor(function(res){
        if (res.status === "success"){
          $scope.listening = false;
        }
      });
    }
  };

  function getLogs(){
    intervalCancel = $interval(function() {
      homeService.getLogs(function(res){
         $scope.logs = res;
      });
    }, 1000);
  }

  $scope.$on('$destroy', function() {
    $scope.stop();
  });

});

// Filtering logs status
angular.module('app')
.filter('statusFilter', function() {
  return function(number) {
    var status = ['<span class="text-success"><b>Add</b></span>' ,
                  '<span class="text-warning"><b>Rename</b></span>',
                  '<span class="text-danger"><b>Remove<b></span>'];
    return status[number];
  };
});
