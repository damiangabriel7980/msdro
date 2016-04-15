/**
 * Created by andreimirica on 12.04.2016.
 */
/**
 * Created by andreimirica on 07.04.2016.
 */

define(['jquery', 'angular', 'ocLazyLoad', 'App', 'controllers', 'services', 'directives', 'filters', 'sharedControllers', 'sharedDirectives', 'sharedServices'], function(jquery, angular, ocLazyLoad, App, controllers, services, directives, filters, sharedControllers, sharedDirectives, sharedServices) {
    var scope, createController, httpBackend, http, modalInstance, controllerProvider;
    console.log(ocLazyLoad);

    // beforeEach(function() {
    //     module('app');
    // });

    // beforeEach(inject(function($controller, $rootScope, $httpBackend, $http, $controllerProvider){
    //     scope = $rootScope.$new();
    //     httpBackend = $httpBackend;
    //     console.log($controllerProvider);
    //     controllerProvider = $controllerProvider;
    //     http = $http;
    //     modalInstance = {                    // Create a mock object using spies
    //         close: jasmine.createSpy('modalInstance.close'),
    //         dismiss: jasmine.createSpy('modalInstance.dismiss'),
    //         result: {
    //             then: jasmine.createSpy('modalInstance.result.then')
    //         }
    //     };
    //     controllerProvider.register('AuthModal', AuthModal);
    //     createController = function(){
    //         return $controller('AuthModal', {
    //             $scope: scope,
    //             $http : http,
    //             $modalInstance: modalInstance,
    //             $controllerProvider: controllerProvider
    //         });
    //     }
    // }));
describe('Login Test', function(){
    it('should return 4', function(){
        // httpBackend.whenGET('partials/public/home.html').respond(200, '');
        // httpBackend.whenGET('partials/public/auth/login.html').respond(200, '');
        //httpBackend.flush();
        // var controller = createController();
        expect(typeof 222).toBe(typeof 23);
    })
    })
});