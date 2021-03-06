app.directive('editUser', function() {
  return {
    templateUrl: 'directives/edit_user.html',
    scope: {
      target: '=target',
      errors: '=errors',
      onSave: '&',
      onDelete: '&'
    },
    controller: ['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
      $scope.errorMessage = '';
      $scope.roleOptions = [{label: 'Manager',value: 'manager'},{label: 'Admin',value: 'admin'}];
      $scope.fields = {roles: []};

      $scope.$watch('target',function(newuser){
        $scope.errorMessage = '';
        $scope.fields = newuser ? _.clone(newuser) : {roles: []};
        if ($scope.fields.roles.length > 0) $scope.fields.role = $scope.fields.roles[0];
      });

      $scope.$watch('errors',function(errors){
        $scope.errorMessage = errors && errors.length > 0 ? errors.join(', ') : '';
      });

      $scope.submitFields = function(){
        if (!$scope.fields.password) delete $scope.fields.password;
        if (!$scope.fields.password_confirmation) delete $scope.fields.password_confirmation;
        if ($scope.fields.password !== $scope.fields.password_confirmation) {
          $scope.errorMessage = 'Password and confirmation do not match';
          return;
        }

        $scope.errorMessage = '';
        $scope.onSave()($scope.fields);
      };
    }]
  };
});
