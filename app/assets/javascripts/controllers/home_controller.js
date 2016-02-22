app.controller('HomeController',['$scope','globalSetup',function($scope,globalSetup) {
  $scope.stateTypes = {jogtimes: 'Jog Times',weeks: 'Weeks'};
  $scope.currentState = _.keys($scope.stateTypes)[0];

  $scope.setHomeState = function(state){
    $scope.currentState = state;
  };
}]);