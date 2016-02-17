var app = angular.module('ToptalTest',[
  'ngRoute',
  'ngResource',
  'ng-token-auth',
  'ui.bootstrap',
  'ui.bootstrap.datepicker'
]);

app.config(['$locationProvider','$authProvider','$httpProvider',function($locationProvider,$authProvider,$httpProvider) {

  $locationProvider.html5Mode({ enabled: true, requireBase: false });
  $authProvider.configure({storage: 'localStorage'});
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

}]);

app.filter('floor', function() { return function(input) { return Math.floor(input); }; });

app.run(['$rootScope','$auth','$window',function($rootScope,$auth,$window){
  $auth.initialize();

  $auth.validateUser().then(
    function(user){
      $rootScope.user.signedOut = false;
    },
    function(result){
      $rootScope.user.signedOut = true;
    });

  $rootScope.errorMessages = '';
  $rootScope.signIn = function(credentials) {
    $auth.submitLogin(credentials)
      .catch(function(resp) {
        console.log('SIGN IN FAILURE');
        console.log(resp);
        $rootScope.errorMessage = resp.errors.join(', ');
      });
  };

  $rootScope.signOut = function(){
    $auth.signOut()
      .then(function(resp) {
        $window.location.reload();
      })
      .catch(function(resp) {
        console.log('SIGN OUT FAILURE');
        console.log(resp);
      });
  };

  $rootScope.unitTypes = {km: 1.0, mi: 1.60934};


}]);
