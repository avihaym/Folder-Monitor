'use strict';
angular
  .module('app', [
    'ngSanitize',
    'ngMessages',
    'ui.router',
    'angular-jwt',
  ])
  .constant("myConfig", {
        server : "http://localhost:3000",
    })
    .run(function($rootScope, $state, jwtHelper){
      $rootScope.$on('$stateChangeStart',  function (event, next) {
        // check if user authorized
        if (next.url !== '/login'){
          var token = localStorage.getItem('token');
            if (!token || jwtHelper.isTokenExpired(token)){
              event.preventDefault();
              localStorage.removeItem('token');
              $state.transitionTo('login');
            }
        }
      });
    })
  .config(function($stateProvider, $urlRouterProvider , $httpProvider, jwtOptionsProvider) {

    // Set token in every http request
    jwtOptionsProvider.config({
      whiteListedDomains: ['localhost'],
      tokenGetter: [function() {
        return localStorage.getItem('token');
      }]
    });
    $httpProvider.interceptors.push('jwtInterceptor');
    $urlRouterProvider.otherwise('login');

    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/home.html',
      controller: 'homeCtrl',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'authCtrl',
    })
  });
