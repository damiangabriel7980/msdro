var publicServices = angular.module('publicServices', ['ngResource']);

publicServices.factory('HomeService', ['$resource', function($resource){
    return {
        getCarouselData: $resource('apiPublic/getCarouselData/', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);