var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return $resource('api/content/:id', {}, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST'},
        delete: { method: 'DELETE'}
    });
}]);

cloudAdminServices.factory('ProductService', ['$resource', function($resource){
    return $resource('api/products/:id', {}, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST'},
        delete: { method: 'DELETE'}
    });
}]);

cloudAdminServices.factory('therapeuticAreaService', ['$resource', function($resource){
    return $resource('api/therapeutic_areas/:id', {}, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST'},
        delete: { method: 'DELETE'}
    });
}]);