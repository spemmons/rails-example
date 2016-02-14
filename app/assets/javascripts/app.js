var app = angular.module('ToptalTest',[
  'ngRoute',
  'ngResource',
  'ng-token-auth'
]);

app.config(['$locationProvider','$authProvider',function($locationProvider,$authProvider) {

  $locationProvider.html5Mode({ enabled: true, requireBase: false });
  $authProvider.configure({storage: 'localStorage'});

}]);
