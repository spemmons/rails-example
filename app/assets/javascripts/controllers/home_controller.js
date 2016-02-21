app.controller('HomeController',['$scope','$rootScope','$auth','$window','$http',function($scope,$rootScope,$auth,$window,$http) {
  $scope.stateTypes = {jogtimes: 'Jog Times',weeks: 'Weeks'};
  $scope.currentState = _.keys($scope.stateTypes)[0];

  $scope.setHomeState = function(state){
    $scope.currentState = state;
  };
}]);