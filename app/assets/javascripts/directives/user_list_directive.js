app.directive('userList', function() {
  return {
    templateUrl: 'directives/user_list.html',
    scope: true,
    controller: ['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
      $scope.roleLabels = {regular: 'Regular',manager: 'Manager',admin: 'Admin'};

      $scope.users = [];
      $scope.userErrors = [];
      $scope.targetUser = {roles: []};
      $scope.lastUser = {};

      $http.get('/api/user')
        .success(function(result){
          $scope.users = _.sortBy(result,function(entry){ return entry.email; });
        })
        .error(setUserErrors);

      $scope.toggleTargetUser = function(target){
        $scope.targetUser = $scope.targetUser === target ? {roles: []} : target;
        $scope.lastUser = {};
      };

      $scope.saveUser = function(fields){
        fields.roles = fields.role && fields.role != 'regular' ? fields.role : '';
        $scope.lastUser = {};
        if (fields.id !== $scope.targetUser.id)
          setUserErrors(['Target user does not match']);
        else if (fields.id) {
          $http.patch('/api/user/' + fields.id,{user: fields})
              .success(function (result){
                $scope.users = _.without($scope.users,$scope.targetUser);
                $scope.users.unshift(result);
                $scope.targetUser = {roles: []};
                $scope.lastUser = result;
              })
              .error(setUserErrors);
        } else {
          $http.post('/api/user',{user: fields})
              .success(function(result){
                $scope.users.unshift(result);
                $scope.lastUser = result;
              })
              .error(setUserErrors);
        }
      };

      $scope.deleteUser = function(fields){
        $scope.lastUser = {};
        if (fields.id !== $scope.targetUser.id)
          setUserErrors(['Target user does not match']);
        else {
          $http.delete('/api/user/' + fields.id)
              .success(function(result){
                $scope.users = _.without($scope.users,$scope.targetUser);
                $scope.targetUser = {roles: []};
              })
              .error(setUserErrors);
        }
      };

      $scope.impersonateUser = function(user){
        $rootScope.currentUser = user;
      };

      function setUserErrors(errors){
        $scope.userErrors = errors;
      }

    }]
  };
});
