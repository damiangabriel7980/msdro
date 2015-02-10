var publicServices = angular.module('publicServices', ['ngResource']);

publicServices.factory('HomeService', ['$resource', function($resource){
    return {
        getCarouselData: $resource('apiPublic/getCarouselData/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        contentByType: $resource('apiPublic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        events: $resource('apiPublic/events', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);
publicServices.factory('ContentService', ['$resource', function($resource){
    return {
        contentByType: $resource('apiPublic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        mostReadByType: $resource('apiPublic/mostReadContentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        contentById: $resource('apiPublic/contentById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        contentByTypeAndTherapeuticArea: $resource('apiPublic/contentByTypeAndTherapeuticArea', {}, {
            query: { method: 'POST', isArray: true }
        }),
        therapeuticAreas: $resource('apiPublic/therapeuticAreas/', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);
publicServices.factory('AuthService', ['$resource', function($resource){
    return {
        login: $resource('/login', {}, {
            query: { method: 'POST', isArray: false }
        })
    }
}]);