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

//cloudAdminServices.factory('UserGroup', ['$resource', function($resource){
//    return {
//        getById: $resource('api/userGroup/:group_id', {}, {
//            query: { method: 'GET', isArray: true }
//        }),
//        getByType: $resource('api/userGroup', {}, {
//            query: { method: 'GET', isArray: true }
//        })
//    }
//}]);

cloudAdminServices.factory('ProductService', ['$resource', function($resource){
    return {
        getAll: $resource('api/products/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByArea: $resource('api/products/productsByArea/:id', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

cloudAdminServices.factory('therapeuticAreaService', ['$resource', function($resource){
    return $resource('api/therapeutic_areas/:id', {}, {
        query: { method: 'GET', isArray: true }
    });
}]);

cloudAdminServices.factory('eventsService', ['$resource', function($resource){
    return $resource('api/calendar/', {}, {
        query: { method: 'GET', isArray: true }
    });
}]);