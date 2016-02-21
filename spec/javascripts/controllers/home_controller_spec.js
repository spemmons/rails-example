//= require angular-mocks/angular-mocks

describe('controller: HomeController', function() {

  var $scope;

  beforeEach(module('ToptalTest',function($provide){

  }));

  beforeEach(inject(function($injector,$controller,$rootScope) {
    $scope = $rootScope.$new();
    $controller('HomeController', { $scope: $scope });
  }));

  it('should set state',function(){
    expect($scope.stateTypes).toEqual({jogtimes: 'Jog Times',weeks: 'Weeks'});
    expect($scope.currentState).toEqual('jogtimes');
  });

  it('should update update',function(){
    $scope.setHomeState('weeks');
    expect($scope.currentState).toEqual('weeks');
  });

});