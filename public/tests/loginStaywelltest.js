/**
 * Created by andreimirica on 12.04.2016.
 */
describe('Login Tests', function(){
    var scope, createController, httpBackend, http, modalInstance, window;

    beforeEach(function(){
        module("app");
        module(function($provide) {
            // Fake StoreService Implementation returning a promise

            $provide.value('AuthService', {
                isUserAllowedLogin: function () {
                    return true
                },
                login : {
                    query: function() {
                        return {
                            $promise: {
                                then :function(callback) {return callback({success: {accepted: true}});},
                                catch : function (callback) {
                                    {return callback({success: {accepted: true}});}
                                }
                            }
                        };
                    }
                },
                reset : {
                    query: function() {
                        return {
                            $promise: {
                                then :function(callback) {return callback({success: {mailto: 'demo@demo.com'}});},
                                catch : function (callback) {
                                    {return callback({success: {accepted: true}});}
                                }
                            }
                        };
                    }
                },
                getProHref : function () {
                    return "pro#";
                }
            });

            return null;
        });
    });

    beforeEach(inject(function($controller, $rootScope, $httpBackend, $http, $window){
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        http = $http;
        window = $window;
        modalInstance = {                    // Create a mock object using spies
            close: jasmine.createSpy('modalInstance.close'),
            dismiss: jasmine.createSpy('modalInstance.dismiss'),
            result: {
                then: jasmine.createSpy('modalInstance.result.then')
            }
        };
        createController = function(){
            return $controller('AuthModal', {
                $scope: scope,
                $http : http,
                $modalInstance: modalInstance,
                intent: 'login',
                $window : window
            });
        }
    }));

    it('should return true if login was OK', function(){
        httpBackend.whenGET('partials/public/home.html').respond(200, '');
        httpBackend.whenGET('partials/public/auth/login.html').respond(200, '');
        var controller = createController();
        scope.login();
        expect(scope.madeIt).toEqual(true);
    });

    it('should return false because email address is invalid', function(){
        httpBackend.whenGET('partials/public/home.html').respond(200, '');
        httpBackend.whenGET('partials/public/auth/login.html').respond(200, '');
        var controller = createController();
        scope.thiz.email = null;
        scope.thiz.password = 'demo';
        scope.login();
        expect(scope.alert.show).not.toEqual(false);
    });

    it('should return true because we did not complete the email for reset', function() {
        httpBackend.whenGET('partials/public/home.html').respond(200, '');
        httpBackend.whenGET('partials/public/auth/login.html').respond(200, '');
        var controller = createController();
        scope.thiz.email = null;
        scope.reset();
        expect(scope.alert.show).not.toEqual(false);
    });

    it('should return success because we completed well the email for reset', function() {
        httpBackend.whenGET('partials/public/home.html').respond(200, '');
        httpBackend.whenGET('partials/public/auth/login.html').respond(200, '');
        var controller = createController();
        scope.thiz.email = 'demo@email.com';
        scope.reset();
        expect(scope.alert.type).toEqual('success');
    });
});