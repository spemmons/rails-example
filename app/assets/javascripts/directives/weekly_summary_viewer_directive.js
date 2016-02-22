app.directive('weeklySummaryViewer', function() {
  return {
    templateUrl: 'directives/weekly_summary_viewer.html',
    scope: true,
    controller: ['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
      $scope.topColumns = ['','Duration','Distance','Speed'];
      $scope.sortColumns = {date: 'Start Date',count: 'Jogs',
        duration_min: 'Min',duration_mean: 'Ave.',duration_max: 'Max',
        distance_min: 'Min',distance_mean: 'Ave.',distance_max: 'Max',
        speed_min: 'Min',speed_mean: 'Ave.',speed_max: 'Max'
      };
      $scope.options = {sort: 'date',units: 'km'};
      $scope.summaries = [];

      $rootScope.$watch('currentUser',function(){
        $scope.requestWeeklySummaries();
      });

      $scope.setSortOption = function(value){
        $scope.options.sort = value;
        updateState($scope.summaries);
      };

      $scope.requestWeeklySummaries = function(){
        $http.get(weeklySummaryURL()).success(updateState);
      };

      function updateState(summaries){
        $scope.summaries = _.sortBy(summaries,$scope.options.sort).reverse();
      }

      function weeklySummaryURL(){
        return $rootScope.user.id == $rootScope.currentUser.id ? '/api/weekly_summaries' : '/api/user/' + $rootScope.currentUser.id + '/weekly_summaries';
      }
    }]
  };
});
