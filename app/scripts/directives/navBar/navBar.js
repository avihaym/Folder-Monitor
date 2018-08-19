'use strict';
angular.module('app')
.directive('navbar',[function() {
  return {
    templateUrl:'scripts/directives/navBar/nav.html',
    restrict: 'E',
    replace: true,
    scope: {},
     controller:function($scope, $state){
       $scope.logout = function(){
         localStorage.removeItem('token');
       }
     }
  };
}]);
