var services = angular.module('services', ['ngResource']);

services.factory('HomeService', ['$resource', function($resource){
    return {
        getCarouselData: $resource('apiPublic/getCarouselData/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        contentByType: $resource('apiPublic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        events: $resource('apiPublic/events', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);
services.factory('ContentService', ['$resource', function($resource){
    return {
        contentByType: $resource('apiPublic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        mostReadByType: $resource('apiPublic/mostReadContentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        contentById: $resource('apiPublic/contentById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        contentByTypeAndTherapeuticArea: $resource('apiPublic/contentByTypeAndTherapeuticArea', {}, {
            query: { method: 'POST', isArray: true }
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