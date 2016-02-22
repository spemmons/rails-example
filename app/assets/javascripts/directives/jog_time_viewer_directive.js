app.directive('jogTimeViewer', function() {
  return {
    templateUrl: 'directives/jog_time_viewer.html',
    scope: true,
    controller: ['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
      $scope.sortColumns = {date: 'Date',duration: 'Duration',distance: 'Distance',speed: 'Ave. Speed'};
      $scope.options = {sort: 'date',units: 'km',dates: 'all',maxTimes: 10};
      $scope.jogtimes = [];
      $scope.lasttime = {};
      $scope.jogTimeErrors = [];

      $rootScope.$watch('currentUser',function(){
        $scope.requestJogTimes();
      });

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
      };

      $scope.toggleJogTime = function(jogtime){
        $scope.lasttime = {};
        setJogTimeErrors([]);
        if (jogtime === $scope.oldtime) {
          delete $scope.oldtime;
          $scope.newtime = {};
        } else {
          $scope.oldtime = jogtime;
          $scope.newtime = _.clone(jogtime);
        }
      };

      $scope.saveJogTime = function(){
        $scope.lasttime = {};
        if ($scope.oldtime) {
          $http.patch(jogTimeURL() + '/' + $scope.oldtime.id,{jog_time: {date: $scope.newtime.date,duration: $scope.newtime.duration,distance: $scope.newtime.distance}})
              .success(function (result){
                $scope.oldtime.date = result.date;
                $scope.oldtime.duration = result.duration;
                $scope.oldtime.distance = result.distance;
                $scope.lasttime = $scope.oldtime;
                updateState($scope.jogtimes);
              })
              .error(setJogTimeErrors);
        } else {
          $http.post(jogTimeURL(),{jog_time: {date: $scope.newtime.date,duration: $scope.newtime.duration,distance: $scope.newtime.distance}})
              .success(function(result){
                $scope.lasttime = result;
                $scope.jogtimes.push(result);
                updateState($scope.jogtimes);
              })
              .error(setJogTimeErrors);
        }
      };

      $scope.deleteJogTime = function(){
        $scope.lasttime = {};
        if ($scope.oldtime) {
          $http.delete(jogTimeURL() + '/' + $scope.oldtime.id)
              .success(function(result){
                $scope.jogtimes = _.without($scope.jogtimes,$scope.oldtime);
                $scope.newtime = {};
                delete $scope.oldtime;
                setJogTimeErrors([]);
              })
              .error(setJogTimeErrors);
        }
      };

      $scope.validDateRange = function(){
        return $scope.options.dates == "range" && $scope.options.fromDate && $scope.options.toDate;
      };

      $scope.requestJogTimes = function(){
        var url = jogTimeURL() + '?sort=' + $scope.options.sort + '&limit=' + $scope.options.maxTimes;
        if ($scope.validDateRange())
          url += '&from=' + $scope.options.fromDate.toISOString() + '&to=' + $scope.options.toDate.toISOString();
        $http.get(url).success(updateState).error(setJogTimeErrors);
      };

      function updateState(jogtimes){
        setJogTimeErrors([]);
        _.each(jogtimes,function(value){
          try {
            value.speed = value.distance / value.duration;
          } catch(err) {
          }
        });
        $scope.jogtimes = _.sortBy(jogtimes,$scope.options.sort).reverse();
        $scope.newtime = {};
        delete $scope.oldtime;
      }

      function jogTimeURL(){
        return $rootScope.user.id == $rootScope.currentUser.id ? '/api/jog_time' : '/api/user/' + $rootScope.currentUser.id + '/jog_time';
      }

      function setJogTimeErrors(errors){
        $scope.jogTimeErrors = errors;
      }
    }]
  };
});
