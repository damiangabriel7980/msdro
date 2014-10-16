var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return {
        getById: $resource('api/content/:content_id', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByType: $resource('api/content/type/:content_type', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);