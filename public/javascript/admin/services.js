var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('GrupuriService', ['$resource', function($resource){
    return {
        getAllGroups: $resource('api/admin/utilizatori/grupuri', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getAllUsers: $resource('api/admin/utilizatori/utilizatori', {}, {
            query: { method: 'GET', isArray: true }
        }),
        addGroup: $resource('api/admin/utilizatori/addGroup/:data', {}, {
            save: { method: 'POST'}
        }),
        deleteGroup: $resource('api/admin/utilizatori/deleteGroup/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        test: $resource('api/admin/utilizatori/test/:data', {}, {
            save: { method: 'POST'}
        })
    }
}]);