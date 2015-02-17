var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);
cloudAdminServices.factory('AmazonService', ['$resource', '$rootScope', function($resource, $rootScope){
    var getCredentialsFromServer = $resource('api/admin/s3tc', {}, {
        query: { method: 'GET', isArray: false }
    });
    var getClient = function (callback) {
        getCredentialsFromServer.query().$promise.then(function (resp) {
            AWS.config.update({accessKeyId: resp.Credentials.AccessKeyId, secretAccessKey: resp.Credentials.SecretAccessKey, sessionToken: resp.Credentials.SessionToken});
            callback(new AWS.S3());
        });
    };
    return {
        getBucketName: function () {
            return $rootScope.amazonBucket;
        },
        getBucketUrl: function () {
            return $rootScope.pathAmazonDev;
        },
        getClient: function (callback) {
            getCredentialsFromServer.query().$promise.then(function (resp) {
                AWS.config.update({accessKeyId: resp.Credentials.AccessKeyId, secretAccessKey: resp.Credentials.SecretAccessKey, sessionToken: resp.Credentials.SessionToken});
                callback(new AWS.S3());
            });
        },
        uploadFile: function (fileBody, key, callback) {
            getClient(function (s3) {
                var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: fileBody, ACL:'public-read', ContentType: fileBody.type}, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, true);
                    }
                });
//                req.on('httpUploadProgress', function (evt) {
//                    var progress = parseInt(100.0 * evt.loaded / evt.total);
//                    console.log(progress);
//                });
            });
        },
        //receives an array of form [{fileBody: yourFileBody, key: yourKey}, ...]
        uploadFiles: function (inputArray, callback) {
            getClient(function (s3) {
                async.each(inputArray, function (input, cb) {
                    s3.putObject({Bucket: $rootScope.amazonBucket, Key: input.key, Body: input.fileBody, ACL:'public-read', ContentType: input.fileBody.type}, function (err, data) {
                        if (err) {
                            cb(err);
                        } else {
                            cb();
                        }
                    });
                }, function (err) {
                    if(err){
                        callback(err, null);
                    }else{
                        callback(null, true);
                    }
                });
            });
        },
        //receives an array of keys [key1, key2, ...]
        deleteFiles: function (inputArray, callback) {
            getClient(function (s3) {
                async.each(inputArray, function (key, cb) {
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key: key}, function (err, data) {
                        if (err) {
                            cb(err);
                        } else {
                            cb();
                        }
                    });
                }, function (err) {
                    if(err){
                        callback(err, null);
                    }else{
                        callback(null, true);
                    }
                });
            });
        },
        deleteFile: function (key, callback) {
            getClient(function (s3) {
                s3.deleteObject({Bucket: $rootScope.amazonBucket, Key: key}, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, true);
                    }
                });
            });
        },
        getContentsAtPath: function (path, callback) {
            console.log(path);
            getClient(function (s3) {
                s3.listObjects({Bucket: $rootScope.amazonBucket, Prefix: path, Marker: path}, function (err, data) {
                    if(err){
                        console.log("S3 getContentsAtPath error");
                        console.log(err);
                        callback(err, null);
                    }else{
                        callback(null, data.Contents);
                    }
                })
            });
        },
        deleteFilesAtPath: function (path, callback) {
            console.log(path);
            getClient(function (s3) {
                s3.listObjects({Bucket: $rootScope.amazonBucket, Prefix: path, Marker: path}, function (err, data) {
                    if(err){
                        console.log(err);
                        callback(err, null);
                    }else{
                        async.each(data.Contents, function (content, cb) {
                            s3.deleteObject({Bucket: $rootScope.amazonBucket, Key: content.Key}, function (err, data) {
                                if (err) {
                                    cb(err);
                                } else {
                                    cb();
                                }
                            });
                        }, function (err) {
                            if(err){
                                callback(err, null);
                            }else{
                                callback(null, true);
                            }
                        });
                    }
                })
            });
        }
    }
}]);
cloudAdminServices.factory('GroupsService', ['$resource', function($resource){
    return {
        getAllGroups: $resource('api/admin/users/groups', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getProfessions: $resource('api/admin/users/professions', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getAllUsers: $resource('api/admin/users/users', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getAllUsersByGroup: $resource('api/admin/users/usersFromGroup/:id', {}, {
            query: { method: 'GET', isArray: true }
        }),
        addGroup: $resource('api/admin/users/addGroup/:data', {}, {
            save: { method: 'POST'}
        }),
        editGroup: $resource('api/admin/users/editGroup/:data', {}, {
            save: { method: 'POST'}
        }),
        changeGroupLogo: $resource('api/admin/users/changeGroupLogo/:data', {}, {
            save: { method: 'POST'}
        }),
        deleteGroup: $resource('api/admin/users/deleteGroup/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        groupDetails: $resource('api/admin/users/groupDetails/:id', {}, {
            query: { method: 'GET', isArray: false}
        }),
        testSomething: $resource('api/admin/users/test/:data', {}, {
            query: { method: 'POST'}
        })
    }
}]);

cloudAdminServices.factory('SpecialProductsService', ['$resource', function($resource){
    return {
        products: $resource('api/admin/content/specialProducts/products', {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        menu: $resource('api/admin/content/specialProducts/menu', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false }
        }),
        addMenuChild: $resource('api/admin/content/specialProducts/addMenuChild', {}, {
            update: { method: 'PUT', isArray: false }
        }),
        groups: $resource('api/admin/content/specialProducts/groups', {}, {
            query: { method: 'GET', isArray: true }
        }),
        groupsAvailable: $resource('api/admin/content/specialProducts/groupsAvailable', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

cloudAdminServices.factory('NewAccountsService', ['$resource', function($resource){
    return {
        state: $resource('api/admin/users/newAccounts/state/:type', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'PUT', isArray: false }
        }),
        count: $resource('api/admin/users/newAccounts/count', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

cloudAdminServices.factory('publicContentService', ['$resource', function($resource){
    return {
        getAllContent: $resource('api/admin/users/publicContent/getAllContent', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getContentById: $resource('api/admin/users/publicContent/getById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        addContent: $resource('api/admin/users/publicContent/addContent/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        editContent: $resource('api/admin/users/publicContent/editContent/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        toggleContent: $resource('api/admin/users/publicContent/toggleContent/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        deleteContent: $resource('api/admin/users/publicContent/deleteContent/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        getTherapeuticAreas: $resource('api/therapeutic_areas', {}, {
            query: { method: 'GET', isArray: true }
        }),
        changeImageOrFile: $resource('api/admin/users/publicContent/changeImageOrFile/:data', {}, {
            save: { method: 'POST'}
        })
    }
}]);

cloudAdminServices.factory('therapeuticAreaService', ['$resource', function($resource){
    return $resource('api/admin/therapeutic_areas', {}, {
        query: { method: 'GET', isArray: true }
    });
}]);

cloudAdminServices.factory('IndexService', ['$resource', function($resource) {
    return {
        getIndex: $resource('api/admin/indexContent', {}, {
            query: {method: 'GET', isArray: false}
        })
    }
}]);
cloudAdminServices.factory('CarouselPublicService', ['$resource', function($resource){
    return {
        getAllImages: $resource('api/admin/users/carouselPublic/getAllImages', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getContentByType: $resource('api/admin/users/carouselPublic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        addImage: $resource('api/admin/users/carouselPublic/addImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        toggleImage: $resource('api/admin/users/carouselPublic/toggleImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        deleteImage: $resource('api/admin/users/carouselPublic/deleteImage/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        getById: $resource('api/admin/users/carouselPublic/getById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        editImage: $resource('api/admin/users/carouselPublic/editImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        editImagePath: $resource('api/admin/users/carouselPublic/editImagePath:data', {}, {
        save: { method: 'POST', isArray: false }
    })
    }
}]);
cloudAdminServices.factory('CarouselMedicService', ['$resource', function($resource){
    return {
        getAllImages: $resource('api/admin/users/carouselMedic/getAllImages', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getContentByType: $resource('api/admin/users/carouselMedic/contentByType/:type', {}, {
            query: { method: 'GET', isArray: true }
        }),
        addImage: $resource('api/admin/users/carouselMedic/addImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        toggleImage: $resource('api/admin/users/carouselMedic/toggleImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        deleteImage: $resource('api/admin/users/carouselMedic/deleteImage/:id', {}, {
            save: { method: 'POST', isArray: false}
        }),
        getById: $resource('api/admin/users/carouselMedic/getById/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        editImage: $resource('api/admin/users/carouselMedic/editImage/:data', {}, {
            save: { method: 'POST', isArray: false }
        }),
        editImagePath: $resource('api/admin/users/carouselMedic/editImagePath:data', {}, {
            save: { method: 'POST', isArray: false }
        })

    }
}]);
cloudAdminServices.factory('ProductService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/products/', {}, {
            query: { method: 'GET', isArray: false },
            save: { method: 'POST'}
        }),
        deleteOrUpdateProduct:$resource('api/admin/products/:id', {}, {
            getProduct: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        }),
        editImage: $resource('api/admin/products/editImage/:data', {}, {
            save: { method: 'POST' }
        }),
        editRPC: $resource('api/admin/products/editRPC/:data', {}, {
            save: { method: 'POST' }
        })
    }
}]);
cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/content', {}, {
            query: { method: 'GET', isArray: false },
            save: { method: 'POST'}
        }),
        getGroupsByIds: $resource('api/admin/content/groupsByIds', {}, {
            query: { method: 'POST', isArray: true }
        }),
        deleteOrUpdateContent:$resource('api/admin/content/:id', {id: "@id"}, {
            getContent: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        }),
        editImage: $resource('api/admin/content/editImage/:data', {}, {
            save: { method: 'POST' }
        }),
        editAssociatedImages: $resource('api/admin/content/editAssociatedImages/:data', {}, {
            save: { method: 'POST' }
        })
    }
}]);
cloudAdminServices.factory('EventsAdminService', ['$resource', function($resource){
    return {
        toggleEvent: $resource('api/admin/events/toggleEvent/:data', {}, {
            save: { method: 'POST'}
        }),
        getGroups: $resource('api/admin/users/groups',{},{
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
cloudAdminServices.factory('quizesAdminService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/quizes/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateQuizes:$resource('api/admin/quizes/:id', {}, {
            getTest: {method: 'GET', isArray: false},
            delete: { method: 'DELETE'},
            update: { method: 'PUT'}
        })
    }
}]);
cloudAdminServices.factory('areasAdminService', ['$resource', function($resource){
    return {
        getAll: $resource('api/admin/areas/', {}, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST'}
        }),
        deleteOrUpdateareas:$resource('api/admin/areas/:id', {}, {
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
            save: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false }
        }),
        topicById: $resource('api/admin/applications/qa/topicById/:id', {}, {
            query: { method: 'GET', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        answerGiverById: $resource('api/admin/applications/qa/answerGiverById/:id', {}, {
            query: { method: 'GET', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        medics: $resource('api/admin/applications/qa/medics', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

