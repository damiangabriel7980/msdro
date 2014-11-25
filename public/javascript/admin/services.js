var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('GrupuriService', ['$resource', function($resource){
    return {
        getAllGroups: $resource('api/content/:content_id', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);