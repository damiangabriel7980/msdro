var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('GrupuriService', ['$resource', function($resource){
    return {
        getAllGroups: $resource('api/admin/utilizatori/grupuri', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);