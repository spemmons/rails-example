//= require angular-mocks/angular-mocks

describe('directive: weeklySummaryViewer', function() {

  var directiveScope,parentScope,rootScope,compile,httpBackend,directive;

  beforeEach(module('ToptalTest'));

  beforeEach(inject(function($injector,$rootScope,$compile,$httpBackend) {
    rootScope = $rootScope;
    parentScope = $rootScope.$new();
    compile = $compile;
    httpBackend = $httpBackend;
  }));

  describe('when the user == currentUser',function(){
    beforeEach(function(){
      rootScope.currentUser = rootScope.user;
      httpBackend.expectGET('/api/weekly_summaries').respond(200,[{date:"2016-02-01T00:00:00.000Z",count:1,distance_min:1.0,distance_max:1.0,distance_mean:1.0,duration_min:1,duration_max:1,duration_mean:1,speed_min:1.0,speed_max:1.0,speed_mean:1.0}]);
      directive = compile('<weekly-summary-viewer></weekly-summary-viewer>')(parentScope);
      directiveScope = directive.scope();
      httpBackend.flush();
      parentScope.$digest();
    });

    it('should perform basic state changes',function(){
      expect(directiveScope.options.sort).toEqual('date');
      directiveScope.setSortOption('count');
      expect(directiveScope.options.sort).toEqual('count');
    });

  });

  describe('when the user != currentUser',function(){
    beforeEach(function(){
      rootScope.currentUser = {id: 1};
      httpBackend.expectGET('/api/user/1/weekly_summaries').respond(200,[]);
      directive = compile('<weekly-summary-viewer></weekly-summary-viewer>')(parentScope);
      directiveScope = directive.scope();
      httpBackend.flush();
      parentScope.$digest();
    });

    it('should perform basic state changes',function(){
      expect(directiveScope.options.sort).toEqual('date');
      directiveScope.setSortOption('count');
      expect(directiveScope.options.sort).toEqual('count');
    });

  });

});