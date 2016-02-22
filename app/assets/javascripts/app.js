var app = angular.module('ToptalTest',[
  'ngRoute',
  'ngResource',
  'ng-token-auth',
  'templates',
  'ui.bootstrap',
  'ui.bootstrap.datepicker'
]);

app.config(['$locationProvider','$authProvider','$httpProvider',function($locationProvider,$authProvider,$httpProvider) {

  $locationProvider.html5Mode({ enabled: true, requireBase: false });
  $authProvider.configure({storage: 'localStorage'});
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

}]);

app.service('globalSetup',['$rootScope','$auth','$window',function($rootScope,$auth,$window){

  $rootScope.unitTypes = {km: 1.0, mi: 1.60934};

  $auth.initialize();

  $auth.validateUser().then(
    function(user){
      $rootScope.user.signedOut = false;
      $rootScope.currentUser = $rootScope.user;
    },
    function(result){
      $rootScope.user.signedOut = true;
    });

  $rootScope.signInError = '';
  $rootScope.signIn = function(credentials) {
    $auth.submitLogin(credentials)
      .then(function(resp){
        $rootScope.currentUser = $rootScope.user;
      })
      .catch(function(resp) {
        console.log('SIGN IN FAILURE');
        console.log(resp);
        $rootScope.user.signedOut = true;
        $rootScope.signInError = resp.errors.join(', ');
      });
  };

  $rootScope.signUpError = '';
  $rootScope.signUp = function(credentials) {
    if (credentials.password !== credentials.password_confirmation) {
      $rootScope.signUpError = 'Password and confirmation do not match';
      return;
    }

    $auth.submitRegistration(credentials)
      .then(function(result){
        console.log('SIGN UP SUCCESS');
        $auth.submitLogin(credentials)
          .then(function(resp){
            $rootScope.currentUser = $rootScope.user;
          })
          .catch(function(resp) {
            console.log('POST SIGN UP FAILURE');
            console.log(resp);
            $rootScope.user.signedOut = true;
            $rootScope.signUpError = resp.errors.join(', ');
          });
      })
      .catch(function(resp) {
        console.log('SIGN UP FAILURE');
        console.log(resp);
        $rootScope.user.signedOut = true;
        $rootScope.signUpError = _.isArray(resp.data.errors) ? resp.data.errors.join(', ') : resp.data.errors.full_messages.join(', ');
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

  return {};
}]);

app.filter('floor', function() { return function(input) { return Math.floor(input); }; });
