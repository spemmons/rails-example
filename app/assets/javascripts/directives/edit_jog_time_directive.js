app.directive('editJogTime', function() {
  return {
    templateUrl: 'directives/edit_jog_time.html',
    scope: {
      jogtime: '=jogtime',
      errors: '=errors',
      options: '=?options',
      onSave: '&',
      onDelete: '&'
    },
    controller: ['$scope','$rootScope',function($scope,$rootScope) {
      if (!$scope.options) $scope.options = {units: 'km'};

      $scope.errorMessage = '';
      $scope.$watch('errors',function(errors){
        $scope.errorMessage = errors && errors.length > 0 ? errors.join(', ') : '';
      });

      $scope.fields = {};
      $scope.$watch('jogtime',function(newtime,oldtime){
        $scope.errorMessage = '';
        if (newtime){
          $scope.fields.id = newtime.id;
          $scope.fields.date = newtime.date ? new Date(newtime.date) : undefined;

          delete $scope.fields.hours;
          delete $scope.fields.minutes;
          if (newtime.duration && newtime.duration > 0){
            var totalMinutes = Math.floor(newtime.duration / 60);
            $scope.fields.hours = Math.floor(totalMinutes / 60);
            $scope.fields.minutes = totalMinutes % 60;
          }

          delete $scope.fields.distance;
          if (newtime.distance && newtime.distance > 0)
            $scope.fields.distance = newtime.distance / $rootScope.unitTypes[$scope.options.units];
        }
      });

      $scope.submitFields = function(){
        $scope.jogtime.date = $scope.fields.date;

        var hours = (!$scope.fields.hours || $scope.fields.hours < 0) ? 0 : $scope.fields.hours;
        var minutes = (!$scope.fields.minutes || $scope.fields.minutes < 0) ? 0 : $scope.fields.minutes;
        $scope.jogtime.duration = ((hours + Math.floor(minutes / 60)) * 60 + (minutes % 60)) * 60;

        $scope.jogtime.distance = $scope.fields.distance * $rootScope.unitTypes[$scope.options.units];

        $scope.errorMessage = '';
        $scope.onSave()();
      };
    }]
  };
});
