'use strict';
angular.module('app')
.controller('authCtrl', function($scope, authService, $state) {
  $scope.formData = {};

  $scope.login = function(){
    authService.Login($scope.formData, function(res){
      if (res.status === "success") {
        localStorage.setItem('token', res.token);
        $state.go('home');
      } else {
        $scope.error = "User not found.";
      }
    });
  }
});
