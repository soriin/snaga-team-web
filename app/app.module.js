(function() {
  'use strict';

  var dependencies = [
    'ngMaterial',
    'templates',
    'app.core',
    'app.events',
    'app.layout',
    'app.profile'
  ];

  var app = angular.module('app', dependencies);

  app.constant('VERSION', '0.1.0');

  app.config([
    '$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('authHttpRequestInterceptor');
    }]);

  app.run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(e, to) {
      console.log('routing to:');
      console.log(to);
    });
  });

  app.run(function($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(e, to) {
      console.log('routed to:');
      console.log(to);
    });
  });

  app.run(function($rootScope) {
    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
      console.log('error routing to:');
      console.log(toState);
      console.log(error);
    });
  });
})();
