/**
 * Created by andreimirica on 07.04.2016.
 */
describe('Manage Accounts Test', function(){
    var scope, createController, httpBackend, http;

    beforeEach(function(){
        module("app");
        module(function($provide) {

            // Fake StoreService Implementation returning a promise
            $provide.value('ManageAccountsService', {
                users : {
                    query: function() {
                        return {
                            $promise: {
                                then :function(callback) {return callback({success: [{ some: "thing", hoursInfo: {isOpen: true}}]});}
                            }
                        };
                    }
                }
            });

            return null;
        });
    });

    beforeEach(inject(function($controller, $rootScope, $httpBackend, $http){
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        http = $http;
        createController = function(){
            return $controller('ManageAccounts', {
                $scope: scope,
                $http : http
            });
        }
    }));

    it('should return 4', function(){
        httpBackend.whenGET('partials/admin/users/root.html').respond(200, '');
        httpBackend.whenGET('partials/admin/users/manageAccounts.html').respond(200, '');
        httpBackend.flush();
        var controller = createController();
        expect(typeof scope.data).toBe(typeof []);
    })
});

describe('View Account Test', function(){
    var scope, createController, httpBackend, http, modalInstance;

    beforeEach(function(){
        module("app");
        module(function($provide) {

            // Fake StoreService Implementation returning a promise
            $provide.value('ManageAccountsService', {
                professions : {
                    query: function() {
                        return {
                            $promise: {
                                then :function(callback) {return callback({success: [{ some: "thing", hoursInfo: {isOpen: true}}]});},
                                catch: function(callback) {return callback({success: { some: "thing", hoursInfo: {isOpen: true}}});}
                            }
                        };
                    }
                },
                users : {
                    query: function(id) {
                        return {
                            $promise: {
                                then :function(callback) {return callback({success: { some: "thing", hoursInfo: {isOpen: true}}});},
                                catch: function(callback) {return callback({success: { some: "thing", hoursInfo: {isOpen: true}}});}
                            }
                        };
                    },
                    update: function() {
                        return {
                            $promise: {
                                then :function(callback) {return callback({success: { some: "thing", hoursInfo: {isOpen: true}}});},
                                catch: function(callback) {return callback({success: { userExists: false, hoursInfo: {isOpen: true}}});}
                            }
                        };
                    }
                },
                groups : {
                    query: function() {
                        return {
                            $promise: {
                                then :function(callback) {return callback({success: [{ some: "thing", hoursInfo: {isOpen: true}}]});},
                                catch: function(callback) {return callback({success: { some: "thing", hoursInfo: {isOpen: true}}});}
                            }
                        };
                    }
                }
            });

            return null;
        });
    });

    beforeEach(inject(function($controller, $rootScope, $httpBackend, $http){
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        http = $http;
        modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
        createController = function(){
            return $controller('ViewAccount', {
                $scope: scope,
                $http : http,
                $modalInstance: modalInstance,
                idToView: "SomeId"
            });
        }
    }));

    it('should return OK', function(){
        httpBackend.whenGET('partials/admin/users/root.html').respond(200, '');
        httpBackend.whenGET('partials/admin/users/viewAccount.html').respond(200, '');
        httpBackend.whenGET('partials/admin/users/manageAccounts.html').respond(200, '');
        httpBackend.flush();
        var controller = createController();
        console.log(scope.saveModifiedUser);
        scope.saveModifiedUser();
        expect(typeof scope.professions).toBe(typeof []);
        expect(typeof scope.user).toBe(typeof {});
        expect(typeof scope.groups).toBe(typeof []);
        expect(scope.saveSuccess).toBe(true);
    })
});