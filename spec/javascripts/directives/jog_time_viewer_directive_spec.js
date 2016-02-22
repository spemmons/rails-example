//= require angular-mocks/angular-mocks

describe('directive: jogTimeViewer', function() {

  var directiveScope,parentScope,rootScope,compile,httpBackend,directive;

  beforeEach(module('ToptalTest'));

  beforeEach(inject(function($injector,$rootScope,$compile,$httpBackend) {
    rootScope = $rootScope;
    parentScope = $rootScope.$new();
    compile = $compile;
    httpBackend = $httpBackend;
    $injector.get('globalSetup');
  }));


  describe('with user == currentUser',function() {
    it('should request the correct URL',function() {
      rootScope.currentUser = {id: 1};
      httpBackend.expectGET('/api/user/1/jog_time?sort=date&limit=10').respond(200,[{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0},{id: 2,date: "2016-02-02T00:00:00.000Z",duration: 2,distance: 2.0}]);
      directive = compile('<jog-time-viewer></jog-time-viewer>')(parentScope);
      directiveScope = directive.scope();
      httpBackend.flush();
      parentScope.$digest();
      expect(directiveScope.jogtimes.length).toEqual(2);
    });
  });

  describe('with user == currentUser',function(){
    beforeEach(function(){
      rootScope.currentUser = rootScope.user;
    });

    describe('with a failure to get jogtimes',function(){
      beforeEach(function(){
        httpBackend.expectGET('/api/jog_time?sort=date&limit=10').respond(421,['some error']);
        directive = compile('<jog-time-viewer></jog-time-viewer>')(parentScope);
        directiveScope = directive.scope();
        parentScope.$digest();
        httpBackend.flush();
      });

      it('should set the userErrors value',function() {
        expect(directiveScope.jogTimeErrors).toEqual(['some error']);
      });
    });

    describe('with a couple of jogtimes',function(){
      beforeEach(function(){
        httpBackend.expectGET('/api/jog_time?sort=date&limit=10').respond(200,[{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0},{id: 2,date: "2016-02-02T00:00:00.000Z",duration: 2,distance: 2.0}]);
        directive = compile('<jog-time-viewer></jog-time-viewer>')(parentScope);
        directiveScope = directive.scope();
        httpBackend.flush();
        parentScope.$digest();
      });

      it('should perform basic state changes',function(){

        expect(directiveScope.jogtimes.length).toEqual(2);
        expect(directiveScope.newtime).toEqual({});

        directiveScope.toggleJogTime(directiveScope.jogtimes[0]);
        expect(directiveScope.newtime).toEqual(directiveScope.jogtimes[0]);

        directiveScope.toggleJogTime(directiveScope.jogtimes[1]);
        expect(directiveScope.newtime).toEqual(directiveScope.jogtimes[1]);

        directiveScope.toggleJogTime(directiveScope.jogtimes[1]);
        expect(directiveScope.newtime).toEqual({});

        directiveScope.setMaxTimesOption(50);
        httpBackend.expectGET('/api/jog_time?sort=date&limit=50').respond(200,[{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0},{id: 2,date: "2016-02-02T00:00:00.000Z",duration: 2,distance: 2.0}]);
        httpBackend.flush();
        parentScope.$digest();
        expect(directiveScope.jogtimes.length).toEqual(2);

        directiveScope.setMaxTimesOption(50);
        parentScope.$digest();

        directiveScope.setSortOption('distance');
        httpBackend.expectGET('/api/jog_time?sort=distance&limit=50').respond(200,[{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0},{id: 2,date: "2016-02-02T00:00:00.000Z",duration: 2,distance: 2.0}]);
        httpBackend.flush();
        parentScope.$digest();
        expect(directiveScope.jogtimes.length).toEqual(2);

        directiveScope.setDatesOption('all');
        parentScope.$digest();

        directiveScope.setDatesOption('range');
        parentScope.$digest();

        directiveScope.setDatesOption('all');
        httpBackend.expectGET('/api/jog_time?sort=distance&limit=50').respond(200,[{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0},{id: 2,date: "2016-02-02T00:00:00.000Z",duration: 2,distance: 2.0}]);
        httpBackend.flush();
        parentScope.$digest();
        expect(directiveScope.jogtimes.length).toEqual(2);

        directiveScope.options.fromDate = new Date("2016-02-01T00:00:00.000Z");
        directiveScope.options.toDate = new Date("2016-02-02T00:00:00.000Z");
        directiveScope.setDatesOption('range');
        httpBackend.expectGET('/api/jog_time?sort=distance&limit=50&from=2016-02-01T00:00:00.000Z&to=2016-02-02T00:00:00.000Z').respond(200,[{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0},{id: 2,date: "2016-02-02T00:00:00.000Z",duration: 2,distance: 2.0}]);
        httpBackend.flush();
        parentScope.$digest();
        expect(directiveScope.jogtimes.length).toEqual(2);
      });

      it('should save changes to the newtime',function(){
        expect(directiveScope.jogtimes[0].id).toEqual(2);

        httpBackend.expectPATCH('/api/jog_time/1',{jog_time: {date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0}}).respond(200,{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0});

        directiveScope.toggleJogTime(directiveScope.jogtimes[1]);
        directiveScope.saveJogTime({id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0});

        httpBackend.flush();
        directiveScope.$digest();

        expect(directiveScope.newtime).toEqual({});
        expect(directiveScope.lasttime.id).toEqual(1);
      });

      it('should create a new jog_time',function(){
        httpBackend.expectPOST('/api/jog_time',{jog_time: {}}).respond(200,{id: 3,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0});

        directiveScope.saveJogTime({date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0});

        httpBackend.flush();
        directiveScope.$digest();

        expect(directiveScope.newtime).toEqual({});
        expect(directiveScope.lasttime.id).toEqual(3);
      });

      it('should delete the newtime',function(){
        expect(directiveScope.jogtimes.length).toEqual(2);

        directiveScope.deleteJogTime();
        directiveScope.$digest();

        httpBackend.expectDELETE('/api/jog_time/1').respond(200,{id: 1,date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0});

        directiveScope.toggleJogTime(directiveScope.jogtimes[1]);
        directiveScope.deleteJogTime();

        httpBackend.flush();
        directiveScope.$digest();

        expect(directiveScope.jogtimes.length).toEqual(1);
        expect(directiveScope.newtime).toEqual({});
        expect(directiveScope.lasttime).toEqual({});
      });
    });
  });

});