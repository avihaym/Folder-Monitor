'use strict';
angular.module('app').config(['$httpProvider',function($httpProvider) {
  $httpProvider.interceptors.push('responseErrorFact');
}]);

angular.module('app').factory('responseErrorFact', function ($q, $injector) {
    return {
        responseError : function(errorResponse) {
            if (errorResponse.status === 403){
                var $state = $injector.get('$state');
                $state.go('login');
            }
            return $q.reject(errorResponse);
        }
    };
});
