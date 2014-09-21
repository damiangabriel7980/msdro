var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource'])

cloudAdminServices.factory('ChildrenService', ['$resource', function($resource){
    return $resource('api/children/:id', {}, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST'},
        delete: { method: 'DELETE'}
    });
}]);