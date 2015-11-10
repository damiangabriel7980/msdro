'use strict';

describe('Controller: AdminConferenceCtrl', function () {

  // load the controller's module
  beforeEach(module('qConferencesApp'));

  var AdminConferenceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminConferenceCtrl = $controller('AdminConferenceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
