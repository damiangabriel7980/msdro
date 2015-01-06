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
cloudAdminServices.factory('ContinutPublicService', ['$resource', function($resource){
    return {
        getAllContent: $resource('api/admin/utilizatori/continutPublic/getAllContent', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getContentById: $resource('api/admin/utilizatori/continutPublic/getById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        addContent: $resource('api/admin/utilizatori/continutPublic/addContent/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        editContent: $resource('api/admin/utilizatori/continutPublic/editContent/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        toggleContent: $resource('api/admin/utilizatori/continutPublic/toggleContent/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        deleteContent: $resource('api/admin/utilizatori/continutPublic/deleteContent/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        getTherapeuticAreas: $resource('api/therapeutic_areas', {}, {
            query: { method: 'GET', isArray: true }
        }),
        changeImageOrFile: $resource('api/admin/utilizatori/continutPublic/changeImageOrFile/:data', {}, {
            save: { method: 'POST'}
        })
    }
}]);
cloudAdminServices.factory('CarouselPublicService', ['$resource', function($resource){
    return {
        getAllImages: $resource('api/admin/utilizatori/carouselPublic/getAllImages', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getContentByType: $resource('api/admin/utilizatori/carouselPublic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        addImage: $resource('api/admin/utilizatori/carouselPublic/addImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        toggleImage: $resource('api/admin/utilizatori/carouselPublic/toggleImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        deleteImage: $resource('api/admin/utilizatori/carouselPublic/deleteImage/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        getById: $resource('api/admin/utilizatori/carouselPublic/getById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        editImage: $resource('api/admin/utilizatori/carouselPublic/editImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        })
    }
}]);
cloudAdminServices.factory('CarouselMedicService', ['$resource', function($resource){
    return {
        getAllImages: $resource('api/admin/utilizatori/carouselMedic/getAllImages', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getContentByType: $resource('api/admin/utilizatori/carouselMedic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        addImage: $resource('api/admin/utilizatori/carouselMedic/addImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        toggleImage: $resource('api/admin/utilizatori/carouselMedic/toggleImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        deleteImage: $resource('api/admin/utilizatori/carouselMedic/deleteImage/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        getById: $resource('api/admin/utilizatori/carouselMedic/getById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        editImage: $resource('api/admin/utilizatori/carouselMedic/editImage/:data', {}, {
            save: { method: 'POST', isArray: false }
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
        getGroups: $resource('api//admin/utilizatori/grupuri',{},{
            query: { method: 'GET', isArray: true }
        }),
        changeConferenceLogo: $resource('api/admin/conferences/changeConferenceLogo/:data', {}, {
            save: { method: 'POST'}
        }),
        changeSpeakerLogo: $resource('api/admin/speakers/changeSpeakerLogo/:data', {}, {
            save: { method: 'POST'}
        }),
        getAll: $resource('api/admin/events/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateEvents:$resource('api/admin/events/:id', {}, {
            getEvent: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        }),
        getAllSpeakers: $resource('api/admin/speakers/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateSpeakers:$resource('api/admin/speakers/:id', {}, {
            getSpeaker: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        }),
        getAllConferences: $resource('api/admin/conferences/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateConferences:$resource('api/admin/conferences/:id', {}, {
            getConference: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        }),
        getAllTalks: $resource('api/admin/talks/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateTalks:$resource('api/admin/talks/:id', {}, {
            getTalk: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        }),
        getAllRoom: $resource('api/admin/rooms/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateRooms:$resource('api/admin/rooms/:id', {}, {
            getRoom: {method: 'GET', isArray: false},
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
cloudAdminServices.factory('qaService', ['$resource', function($resource){
    return {
        topics: $resource('api/admin/applications/qa/topics', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false }
        }),
        answerGivers: $resource('api/admin/applications/qa/answerGivers', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST', isArray: false }
        }),
        topicById: $resource('api/admin/applications/qa/topicById/:id', {}, {
            query: { method: 'GET', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        answerGiverById: $resource('api/admin/applications/qa/answerGiverById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        medics: $resource('api/admin/applications/qa/medics', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

