var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);
cloudAdminServices.factory('AmazonService', ['$resource', function($resource){
    var getCredentialsFromServer = $resource('api/admin/s3tc', {}, {
        query: { method: 'GET', isArray: false }
    });
    return {
        getClient: function (callback) {
            getCredentialsFromServer.query().$promise.then(function (resp) {
                AWS.config.update({accessKeyId: resp.Credentials.AccessKeyId, secretAccessKey: resp.Credentials.SecretAccessKey, sessionToken: resp.Credentials.SessionToken});
                callback(new AWS.S3());
            });
        }
    }
}]);
cloudAdminServices.factory('GrupuriService', ['$resource', function($resource){
    return {
        getAllGroups: $resource('api/admin/utilizatori/grupuri', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getAllUsers: $resource('api/admin/utilizatori/utilizatori', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getAllUsersByGroup: $resource('api/admin/utilizatori/utilizatoriDinGrup/:id', {}, {
            query: { method: 'GET', isArray: true }
        }),
        addGroup: $resource('api/admin/utilizatori/addGroup/:data', {}, {
            save: { method: 'POST'}
        }),
        editGroup: $resource('api/admin/utilizatori/editGroup/:data', {}, {
            save: { method: 'POST'}
        }),
        changeGroupLogo: $resource('api/admin/utilizatori/changeGroupLogo/:data', {}, {
            save: { method: 'POST'}
        }),
        deleteGroup: $resource('api/admin/utilizatori/deleteGroup/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        groupDetails: $resource('api/admin/utilizatori/groupDetails/:id', {}, {
            query: { method: 'GET', isArray: false}
        }),
        testSomething: $resource('api/admin/utilizatori/test/:data', {}, {
            query: { method: 'POST'}
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
        getAll: $resource('api/admin/content', {}, {
            query: { method: 'GET', isArray: false },
            save: { method: 'POST'}
        }),
        deleteOrUpdateContent:$resource('api/admin/content/:id', {id: "@id"}, {
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

