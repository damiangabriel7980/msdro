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
        })
    }
}]);
