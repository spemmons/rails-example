app.controller('HomeController',['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
  $scope.options = {units: 'km'};
  $scope.newtime = {};
  $scope.jogtimes = [];

  $scope.counter = 0;

  $scope.setJogTime = function(jogtime){
    $scope.oldtime = jogtime;
    $scope.newtime = _.clone(jogtime);
  };

  $scope.saveJogTime = function(){
    if ($scope.oldtime) {
      $scope.oldtime.date = $scope.newtime.date;
      $scope.oldtime.duration = $scope.newtime.duration;
      $scope.oldtime.distance = $scope.newtime.distance;
      delete $scope.oldtime;
    } else {
      $scope.jogtimes.push({id: ++$scope.counter,
        date: $scope.newtime.date,
        duration: $scope.newtime.duration,
        distance: $scope.newtime.distance
      });
    }
    $scope.jogtimes = _.sortBy($scope.jogtimes,'date');
    $scope.newtime = {};
  };

  $scope.deleteJogTime = function(){
    if ($scope.oldtime) {
      $scope.jogtimes = _.without($scope.jogtimes,$scope.oldtime);
      $scope.newtime = {};
      delete $scope.oldtime;
    }
  };
}]);