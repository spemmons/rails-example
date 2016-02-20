app.controller('HomeController',['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
  $scope.stateTypes = ['jogtimes','users'];
  $scope.stateLabels = {jogtimes: 'Jog Times',users: 'Users'};
  $scope.currentState = $scope.stateTypes[0];

  $scope.setHomeState = function(state){
    $scope.currentState = state;
  };
}]);