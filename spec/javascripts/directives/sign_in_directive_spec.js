//= require angular-mocks/angular-mocks

describe('directive: signIn', function() {

  var directiveScope,parentScope,rootScope,compile,httpBackend,directive;

  beforeEach(module('ToptalTest'));

  beforeEach(inject(function($injector,$rootScope,$compile,$httpBackend) {
    rootScope = $rootScope;
    parentScope = $rootScope.$new();
    compile = $compile;
    httpBackend = $httpBackend;
    $injector.get('globalSetup');
  }));

  beforeEach(function(){
    parentScope.date = new Date();
    directive = compile('<sign-in></sign-in>')(parentScope);
    parentScope.$digest();
    directiveScope = directive.isolateScope();
  });

  it('sign in user',function() {
    rootScope.signIn({email: 'test@test.com',password: 'testing!!'});
  });

});