var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return {
        getById: $resource('api/content/:id', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByType: $resource('api/content/:type', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);