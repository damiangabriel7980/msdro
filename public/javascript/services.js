var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return $resource('api/content/:id', {}, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST'},
        delete: { method: 'DELETE'}
    });
}]);