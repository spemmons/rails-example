//= require angular-mocks/angular-mocks

describe('directive: editUser', function() {

  var directiveScope,parentScope,rootScope,compile,directive;

  beforeEach(module('ToptalTest'));

  beforeEach(inject(function($injector,$rootScope,$compile) {
    rootScope = $rootScope;
    parentScope = $rootScope.$new();
    compile = $compile;
    $injector.get('globalSetup');
  }));

  it('should allow errors',function(){
    directive = compile('<edit-user errors="testErrors"></edit-user>')(parentScope);
    parentScope.$digest();

    directiveScope = directive.isolateScope();
    parentScope.$apply('testErrors = ["test1","test2"]');
    expect(directiveScope.errors).toEqual(['test1','test2']);
    expect(directiveScope.errorMessage).toEqual('test1, test2');
  });

  it('should detect change in target and submitFields',function() {
    var saved = false;
    parentScope.testSave = function(){ saved = true; };

    directive = compile('<edit-user target="testUser" on-save="testSave"></edit-user>')(parentScope);
    parentScope.$digest();

    directiveScope = directive.isolateScope();

    parentScope.$apply('testUser = {roles: []}');
    expect(directiveScope.target).toEqual({roles: []});
    expect(directiveScope.fields).toEqual({roles: []});

    parentScope.$apply('testUser = {email: "test@test.com",roles: ["admin"]}');
    expect(directiveScope.target).toEqual({email: 'test@test.com',roles: ['admin']});
    expect(directiveScope.fields).toEqual({email: 'test@test.com',roles: ['admin'],role: 'admin'});

    directiveScope.submitFields();
    expect(directiveScope.target).toEqual({email: 'test@test.com',roles: ['admin']});
    expect(directiveScope.fields).toEqual({email: 'test@test.com',roles: ['admin'],role: 'admin'});
    expect(saved).toBe(true);
    expect(directiveScope.errorMessage).toEqual('');

    saved = false;
    directiveScope.fields.password = 'testing!!';
    directiveScope.submitFields();
    expect(directiveScope.target).toEqual({email: 'test@test.com',roles: ['admin']});
    expect(directiveScope.fields).toEqual({email: 'test@test.com',roles: ['admin'],role: 'admin',password: 'testing!!'});
    expect(directiveScope.errorMessage).toEqual('Password and confirmation do not match');
    expect(saved).toBe(false);

    directiveScope.fields.password_confirmation = 'testing!!';
    directiveScope.submitFields();
    expect(directiveScope.target).toEqual({email: 'test@test.com',roles: ['admin']});
    expect(directiveScope.fields).toEqual({email: 'test@test.com',roles: ['admin'],role: 'admin',password: 'testing!!',password_confirmation: 'testing!!'});
    expect(directiveScope.errorMessage).toEqual('');
    expect(saved).toBe(true);

  });

});