//= require angular-mocks/angular-mocks

describe('directive: stdDatePicker', function() {

  var directiveScope,parentScope,rootScope,compile,httpBackend,directive;

  beforeEach(module('ToptalTest'));

  beforeEach(inject(function($injector,$rootScope,$compile,$httpBackend) {
    rootScope = $rootScope;
    parentScope = $rootScope.$new();
    compile = $compile;
    httpBackend = $httpBackend;
  }));

  beforeEach(function(){
    httpBackend.expectGET('/api/user').respond(421,['some error']);
    parentScope.date = new Date();
    directive = compile('<std-date-picker></std-date-picker>')(parentScope);
    directiveScope = directive.scope();
    parentScope.$digest();
  });

    it('should accept a date',function() {
      expect(directiveScope.date).toEqual(parentScope.date);
    });

});