//= require angular-mocks/angular-mocks

describe('directive: editJogTime', function() {

  var directiveScope,parentScope,rootScope,compile,directive;

  beforeEach(module('ToptalTest'));

  beforeEach(inject(function($injector,$rootScope,$compile) {
    rootScope = $rootScope;
    parentScope = $rootScope.$new();
    compile = $compile;
    $injector.get('globalSetup');
  }));

  it('should allow options',function(){
    parentScope.testOptions = {units: 'mi'};
    directive = compile('<edit-jog-time options="testOptions"></edit-jog-time>')(parentScope);
    parentScope.$digest();

    directiveScope = directive.isolateScope();
    expect(directiveScope.options).toEqual({units: 'mi'});
  });

  it('should allow errors',function(){
    directive = compile('<edit-jog-time errors="testErrors"></edit-jog-time>')(parentScope);
    parentScope.$digest();

    directiveScope = directive.isolateScope();
    parentScope.$apply('testErrors = ["test1","test2"]');
    expect(directiveScope.errors).toEqual(['test1','test2']);
    expect(directiveScope.errorMessage).toEqual('test1, test2');
  });

  it('should detect change in jogtime and submitFields',function() {
    var saved = false;
    parentScope.testSave = function(){ saved = true; };

    directive = compile('<edit-jog-time jogtime="testtime" on-save="testSave"></edit-jog-time>')(parentScope);
    parentScope.$digest();

    directiveScope = directive.isolateScope();
    expect(directiveScope.options).toEqual({units: 'km'});

    parentScope.$apply('testtime = {}');
    expect(directiveScope.jogtime).toEqual({});
    expect(directiveScope.fields).toEqual({id: undefined,date: undefined});

    parentScope.$apply('testtime = {date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0}');
    expect(directiveScope.jogtime).toEqual({date: "2016-02-01T00:00:00.000Z",duration: 1,distance: 1.0});
    expect(directiveScope.fields).toEqual({id: undefined, date: new Date("2016-02-01T00:00:00.000Z"), hours: 0, minutes: 0, distance: 1 });

    directiveScope.fields.hours = 1;
    directiveScope.fields.minutes = 0;
    directiveScope.fields.distance = 2;

    directiveScope.submitFields();
    expect(directiveScope.jogtime).toEqual({date: new Date("2016-02-01T00:00:00.000Z"),duration: 3600,distance: 2.0});
    expect(saved).toBe(true);

    directiveScope.fields.hours = 0;
    directiveScope.fields.minutes = 30;
    directiveScope.fields.distance = 3;
    directiveScope.submitFields();
    expect(directiveScope.jogtime).toEqual({date: new Date("2016-02-01T00:00:00.000Z"),duration: 1800,distance: 3.0});
  });

});