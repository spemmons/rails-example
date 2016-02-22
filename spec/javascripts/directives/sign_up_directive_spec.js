//= require angular-mocks/angular-mocks

describe('directive: signUp', function() {

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
    directive = compile('<sign-up></sign-up>')(parentScope);
    parentScope.$digest();
    directiveScope = directive.isolateScope();
  });

  it('sign in user',function() {
    rootScope.signUp({email: 'test@test.com',password: 'testing!!'});
    expect(rootScope.signUpError).toEqual('Password and confirmation do not match');

    rootScope.signUpError = '';
    rootScope.signUp({email: 'test@test.com',password: 'testing!!',password_confirmation: 'testing!!'});
    expect(rootScope.signUpError).toEqual('');
  });

});