var app = angular.module('ToptalTest',[
  'ngRoute',
  'ngResource',
  'ng-token-auth'
]);

app.config(['$locationProvider','$authProvider','$httpProvider',function($locationProvider,$authProvider,$httpProvider) {

  $locationProvider.html5Mode({ enabled: true, requireBase: false });
  $authProvider.configure({storage: 'localStorage'});
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

}]);

app.run(['$rootScope','$auth','$window',function($rootScope,$auth,$window){
  $auth.initialize();

  console.log('INITIALIZE');
  console.log($rootScope.user);

  $auth.validateUser().then(
    function(user){
      delete user.signedOut;
      console.log('VALID USER!');
      console.log(user);
    },
    function(result){
      console.log('NO USER!');
      console.log(result);
      $rootScope.user.signedOut = true;
    });

  $rootScope.errorMessages = '';
  $rootScope.signIn = function(credentials) {
    console.log('SIGN IN');
    console.log($rootScope.user);
    console.log(credentials);
    $auth.submitLogin(credentials)
      .then(function(user) {
        console.log('SIGN IN SUCCESS');
        console.log(user);
      })
      .catch(function(resp) {
        console.log('SIGN IN FAILURE');
        console.log(resp);
        console.log($rootScope.user);
        $rootScope.errorMessage = resp.errors.join(', ');
      });
  };

  $rootScope.signOut = function(){
    console.log('SIGN OUT');
    console.log($rootScope.user);
    $auth.signOut()
      .then(function(resp) {
        console.log('SIGN OUT SUCCESS');
        console.log(resp);
        console.log($rootScope.user);
        $window.location.reload();
      })
      .catch(function(resp) {
        console.log('SIGN OUT FAILURE');
        console.log(resp);
        console.log($rootScope.user);
      });
  };

}]);