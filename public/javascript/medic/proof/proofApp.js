var proofApp = angular.module('proofApp', ['ngResource','angularFileUpload','ui.bootstrap']);

proofApp.factory('ProofService', ['$resource', function($resource){
    return {
        professions: $resource('api/proof/professions', {}, {
            query: { method: 'GET', isArray: true }
        }),
        proofImage: $resource('api/proof/image', {}, {
            save: {method:'POST'}
        })
    }
}]);