app.controller('HomeController',['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
  $scope.sortOptions = ['date','duration','distance','speed'];
  $scope.sortLabels = {date: 'Most Recent',duration: 'Longest Times',distance: 'Farthest Distances',speed: 'Fastest Speeds'}
  $scope.options = {units: 'km',dates: 'all',maxTimes: 10};
  $scope.jogtimes = [];

  $scope.setDatesOption = function(value){
    if (value === $scope.options.dates) return;

    $scope.options.dates = value;
    if (value == 'all')
      $scope.requestJogTimes();
    else if ($scope.validDateRange())
      $scope.requestJogTimes();
  };

  $scope.setSortOption = function(value){
    $scope.options.sort = value;
    $scope.requestJogTimes();
  };

  $scope.setMaxTimesOption = function(value){
    if ($scope.options.maxTimes == value) return;

    $scope.options.maxTimes = value;
    $scope.requestJogTimes();
  }

  $scope.setJogTime = function(jogtime){
    $scope.oldtime = jogtime;
    $scope.newtime = _.clone(jogtime);
  };

  $scope.saveJogTime = function(){
    if ($scope.oldtime) {
      $http.patch('/api/jog_time/' + $scope.oldtime.id,{jog_time: {date: $scope.newtime.date,duration: $scope.newtime.duration,distance: $scope.newtime.distance}}).success(function (result){
        $scope.oldtime.date = result.date;
        $scope.oldtime.duration = result.duration;
        $scope.oldtime.distance = result.distance;
        delete $scope.oldtime;
        updateState($scope.jogtimes);
      });
    } else {
      $http.post('/api/jog_time',{jog_time: {date: $scope.newtime.date,duration: $scope.newtime.duration,distance: $scope.newtime.distance}}).success(function(result){
        $scope.jogtimes.push(result);
        updateState($scope.jogtimes);
      });
    }
  };

  $scope.deleteJogTime = function(){
    if ($scope.oldtime) {
      $http.delete('/api/jog_time/' + $scope.oldtime.id).success(function(result){
        $scope.jogtimes = _.without($scope.jogtimes,$scope.oldtime);
        $scope.newtime = {};
        delete $scope.oldtime;
      });
    }
  };

  $scope.validDateRange = function(){
    return $scope.options.dates == "range" && $scope.options.fromDate && $scope.options.toDate;
  };

  $scope.requestJogTimes = function(){
    var url = '/api/jog_time?sort=' + $scope.options.sort + '&limit=' + $scope.options.maxTimes;
    if ($scope.validDateRange())
      url += '&from=' + $scope.options.fromDate.toISOString() + '&to=' + $scope.options.toDate.toISOString();
    $http.get(url).success(updateState);
  };

  function updateState(jogtimes){
    $scope.jogtimes = _.sortBy(jogtimes,$scope.options.sort);
    $scope.newtime = {};
  }

  $scope.setSortOption('date');
}]);