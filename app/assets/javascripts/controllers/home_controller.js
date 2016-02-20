app.controller('HomeController',['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
  $scope.stateTypes = ['jogtimes','weeks'];
  $scope.stateLabels = {jogtimes: 'Jog Times',weeks: 'Weeks'};
  $scope.currentState = $scope.stateTypes[0];

  $scope.setHomeState = function(state){
    $scope.currentState = state;
  };
}]);