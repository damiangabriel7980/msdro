var services = angular.module('services', ['ngResource']);

services.factory('HomeService', ['$resource', function($resource){
    return {
        getCarouselData: $resource('apiPublic/getCarouselData/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getSearchResults: $resource('apiPublic/publicSearchResults/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        events: $resource('apiPublic/events', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);
services.factory('ContentService', ['$resource', function($resource){
    return {
        content: $resource('apiPublic/content', {}, {
            query: { method: 'GET', isArray: false }
        }),
        mostReadByType: $resource('apiPublic/mostReadContentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        therapeuticAreas: $resource('apiPublic/therapeuticAreas/', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);
services.factory('AuthService', ['$resource', function($resource){
    return {
        login: $resource('/login', {}, {
            query: { method: 'POST', isArray: false }
        }),
        signup: $resource('/apiGloballyShared/createAccount', {}, {
            query: { method: 'POST', isArray: false }
        }),
        reset: $resource('/apiGloballyShared/requestPasswordReset', {}, {
            query: { method: 'POST', isArray: false }
        })
    }
}]);
services.factory('ProofService', ['$resource', function($resource){
    return {
        professions: $resource('api/proof/professions', {}, {
            query: { method: 'GET', isArray: true }
        }),
        proofImage: $resource('api/proof/image', {}, {
            save: {method:'POST'}
        }),
        specialGroups: $resource('api/proof/specialGroups/:profession', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);