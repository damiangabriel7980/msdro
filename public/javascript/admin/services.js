var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);
cloudAdminServices.factory('GrupuriService', ['$resource', function($resource){
    return {
        getAllGroups: $resource('api/content/:content_id', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);
cloudAdminServices.factory('ProductService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/products/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateProduct:$resource('api/admin/products/:id', {}, {
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);
cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/content/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateContent:$resource('api/admin/content/:id', {}, {
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);
cloudAdminServices.factory('EventsAdminService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/events/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateEvents:$resource('api/admin/events/:id', {}, {
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);

