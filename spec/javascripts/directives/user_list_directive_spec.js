//= require angular-mocks/angular-mocks

describe('directive: userList', function() {

  var directiveScope,parentScope,rootScope,compile,httpBackend,directive;

  beforeEach(module('ToptalTest'));

  beforeEach(inject(function($injector,$rootScope,$compile,$httpBackend) {
    rootScope = $rootScope;
    parentScope = $rootScope.$new();
    compile = $compile;
    httpBackend = $httpBackend;
  }));

  describe('with a failure to get users',function(){
    beforeEach(function(){
      httpBackend.expectGET('/api/user').respond(421,['some error']);
      directive = compile('<user-list></user-list>')(parentScope);
      directiveScope = directive.scope();
      parentScope.$digest();
      httpBackend.flush();
    });

    it('should set the userErrors value',function() {
      expect(directiveScope.userErrors).toEqual(['some error']);
    });
  });

  describe('with a couple of simple users',function(){
    beforeEach(function(){
      httpBackend.expectGET('/api/user').respond(200,[{id: 1,email: 'regular@test.com',roles:[]},{id: 2,email: 'manager@test.com',roles: ['manager']}]);
      directive = compile('<user-list></user-list>')(parentScope);
      directiveScope = directive.scope();
      httpBackend.flush();
      parentScope.$digest();
    });

    it('should perform basic state changes',function(){

      expect(directiveScope.users.length).toEqual(2);
      expect(directiveScope.targetUser).toEqual({roles: []});

      directiveScope.toggleTargetUser(directiveScope.users[0]);
      expect(directiveScope.targetUser).toEqual(directiveScope.users[0]);

      directiveScope.toggleTargetUser(directiveScope.users[1]);
      expect(directiveScope.targetUser).toEqual(directiveScope.users[1]);

      directiveScope.toggleTargetUser(directiveScope.users[1]);
      expect(directiveScope.targetUser).toEqual({roles: []});

      expect(rootScope.currentUser).toEqual(undefined);
      directiveScope.impersonateUser(directiveScope.users[1]);
      expect(rootScope.currentUser).toEqual(directiveScope.users[1]);
    });

    it('should complain when saving a user that is not the targetUser',function(){
      directiveScope.toggleTargetUser(directiveScope.users[1]);
      expect(directiveScope.userErrors).toEqual([]);
      directiveScope.saveUser({email: 'x'});
      expect(directiveScope.userErrors).toEqual(['Target user does not match']);
    });

    it('should save changes to the targetUser',function(){
      expect(directiveScope.users[0].id).toEqual(2);

      httpBackend.expectPATCH('/api/user/1',{user: {id: 1,role: 'admin',roles: 'admin'}}).respond(200,{id: 1,email: 'regular@test.com',roles: ['admin']});

      directiveScope.toggleTargetUser(directiveScope.users[1]);
      directiveScope.saveUser({id: 1,role: 'admin'});

      httpBackend.flush();
      directiveScope.$digest();

      expect(directiveScope.users[0].id).toEqual(1);
      expect(directiveScope.targetUser).toEqual({roles: []});
      expect(directiveScope.lastUser).toEqual(directiveScope.users[0]);
    });

    it('should create a new user',function(){
      httpBackend.expectPOST('/api/user',{user: {email: 'new@test.com',roles: ''}}).respond(200,{id: 3,email: 'new@test.com',roles: []});

      directiveScope.saveUser({email: 'new@test.com'});

      httpBackend.flush();
      directiveScope.$digest();

      expect(directiveScope.users[0].id).toEqual(3);
      expect(directiveScope.targetUser).toEqual({roles: []});
      expect(directiveScope.lastUser).toEqual(directiveScope.users[0]);
    });

    it('should complain when deleting a user that is not the targetUser',function(){
      directiveScope.toggleTargetUser(directiveScope.users[1]);
      expect(directiveScope.userErrors).toEqual([]);
      directiveScope.deleteUser({email: 'x'});
      expect(directiveScope.userErrors).toEqual(['Target user does not match']);
    });

    it('should delete the targetUser',function(){
      expect(directiveScope.users.length).toEqual(2);

      httpBackend.expectDELETE('/api/user/1').respond(200,{});

      directiveScope.toggleTargetUser(directiveScope.users[1]);
      directiveScope.deleteUser(directiveScope.users[1]);

      httpBackend.flush();
      directiveScope.$digest();

      expect(directiveScope.users.length).toEqual(1);
      expect(directiveScope.targetUser).toEqual({roles: []});
      expect(directiveScope.lastUser).toEqual({});
    });
  });

});