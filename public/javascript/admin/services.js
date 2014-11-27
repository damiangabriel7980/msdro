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
            getProduct: {method: 'GET', isArray: false},
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
            getContent: {method: 'GET', isArray: false},
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
            getEvent: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);
cloudAdminServices.factory('MultimediaAdminService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/multimedia/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateMultimedia:$resource('api/admin/multimedia/:id', {}, {
            getMultimedia: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);
cloudAdminServices.factory('testeAdminService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/teste/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateteste:$resource('api/admin/teste/:id', {}, {
            getTest: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);
cloudAdminServices.factory('ariiAdminService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/arii/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdatearii:$resource('api/admin/arii/:id', {}, {
            getArea: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);

