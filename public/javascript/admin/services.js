var services = angular.module('services', ['ngResource']);
services.factory('AmazonService', ['$resource', '$rootScope', 'Success', function($resource, $rootScope, Success){
    var getCredentialsFromServer = $resource('api/admin/s3tc', {}, {
        query: { method: 'GET', isArray: false }
    });
    var getClient = function (callback) {
        getCredentialsFromServer.query().$promise.then(function (resp) {
            var credentials = Success.getObject(resp);
            AWS.config.update({accessKeyId: credentials.AccessKeyId, secretAccessKey: credentials.SecretAccessKey, sessionToken: credentials.SessionToken});
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
        getClient: getClient,
        uploadFile: function (fileBody, key, callback) {
            getClient(function (s3) {
                console.log("upload file");
                console.log($rootScope.amazonBucket);
                console.log(key);
                console.log(fileBody);
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
            if(!key){
                callback(null, "No key was specified");
            }else{
                getClient(function (s3) {
                    console.log("delete file");
                    console.log($rootScope.amazonBucket);
                    console.log('"'+key+'"');
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key: key}, function (err, data) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            callback(null, true);
                        }
                    });
                });
            }
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
            var count = 0;
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
                                    count ++;
                                    cb();
                                }
                            });
                        }, function (err) {
                            if(err){
                                callback(err, null);
                            }else{
                                callback(null, count);
                            }
                        });
                    }
                })
            });
        }
    }
}]);
services.factory('GroupsService', ['$resource', function($resource){
    return {
        groups: $resource('api/admin/users/groups', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        professions: $resource('api/admin/users/professions', {}, {
            query: { method: 'GET', isArray: false }
        }),
        users: $resource('api/admin/users/users', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('SpecialProductsService', ['$resource', function($resource){
    return {
        products: $resource('api/admin/content/specialProducts/products', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        menu: $resource('api/admin/content/specialProducts/menu', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        addMenuChild: $resource('api/admin/content/specialProducts/addMenuChild', {}, {
            update: { method: 'PUT', isArray: false }
        }),
        groups: $resource('api/admin/content/specialProducts/groups', {}, {
            query: { method: 'GET', isArray: false }
        }),
        groupsAvailable: $resource('api/admin/content/specialProducts/groupsAvailable', {}, {
            query: { method: 'GET', isArray: false }
        }),
        glossary: $resource('api/admin/content/specialProducts/glossary', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        resources: $resource('api/admin/content/specialProducts/resources', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        speakers: $resource('api/admin/content/specialProducts/speakers', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        })
    }
}]);

services.factory('SpecialAppsService', ['$resource', function($resource){
    return {
        apps: $resource('api/admin/content/specialApps/apps', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        groups: $resource('api/admin/content/specialApps/groups', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('SystemService', ['$resource', function($resource){
    return {
        codes: $resource('api/admin/system/activationCodes/codes', {}, {
            query: { method: 'GET', isArray: false },
            update: { method: 'PUT', isArray: false }
        }),
        parameters: $resource('api/admin/system/parameters', {}, {
            query: { method: 'GET', isArray: false },
            update: { method: 'PUT', isArray: false }
        })
    }
}]);

services.factory('NewAccountsService', ['$resource', function($resource){
    return {
        state: $resource('api/admin/users/newAccounts/state/:type', {}, {
            query: { method: 'GET', isArray: false },
            save: { method: 'PUT', isArray: false }
        }),
        count: $resource('api/admin/users/newAccounts/count', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('ManageAccountsService', ['$resource', function($resource){
    return {
        users: $resource('api/admin/users/ManageAccounts/users', {}, {
            query: { method: 'GET', isArray: false },
            update: { method: 'PUT', isArray: false }
        }),
        professions: $resource('api/admin/users/ManageAccounts/professions', {}, {
            query: { method: 'GET', isArray: false }
        }),
        groups: $resource('api/admin/users/ManageAccounts/groups', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('IntroService', ['$resource', function($resource){
    return {
        intros: $resource('api/admin/intros/', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        })
    }
}]);

services.factory('publicContentService', ['$resource', function($resource){
    return {
        publicContent: $resource('api/admin/users/publicContent', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        }),
        therapeuticAreas: $resource('api/admin/therapeutic_areas', {}, {
            query: { method: 'GET', isArray: false }
        }),
        changeImageOrFile: $resource('api/admin/users/publicContent/changeImageOrFile/:data', {}, {
            save: { method: 'POST'}
        }),
        categories: $resource('api/admin/users/publicContent/categories', {}, {
            query: { method: 'GET', isArray: false},
            create: { method: 'POST', isArray: false},
            update: { method: 'PUT', isArray: false},
            delete: { method: 'DELETE', isArray: false}
        })
    }
}]);

services.factory('therapeuticAreaService', ['$resource', function($resource){
    return $resource('api/admin/therapeutic_areas', {}, {
        query: { method: 'GET', isArray: false }
    });
}]);

services.factory('CarouselPublicService', ['$resource', function($resource){
    return {
        carouselPublic: $resource('api/admin/users/carouselPublic', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        }),
        attachedContent: $resource('api/admin/users/carouselPublic/contentByType', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);
services.factory('CarouselMedicService', ['$resource', function($resource){
    return {
        carouselMedic: $resource('api/admin/users/carouselMedic', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        }),
        attachedContent: $resource('api/admin/users/carouselMedic/contentByType', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);
services.factory('ProductService', ['$resource', function($resource){
    return {
        products: $resource('api/admin/products', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        })
    }
}]);
services.factory('ContentService', ['$resource', function($resource){
    return {
        content: $resource('api/admin/content', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        }),
        groupsByIds: $resource('api/admin/content/groupsByIds', {}, {
            query: { method: 'POST', isArray: false }
        })
    }
}]);
services.factory('EventsService', ['$resource', function($resource){
    return {
        events: $resource('api/admin/events/events', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        speakers: $resource('api/admin/events/speakers', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        conferences: $resource('api/admin/events/conferences', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        talks: $resource('api/admin/events/talks', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        rooms: $resource('api/admin/events/rooms', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        conferenceToEvent: $resource('api/admin/events/conferenceToEvent', {}, {
            create: { method: 'POST', isArray: false }
        })
    }
}]);
services.factory('MultimediaAdminService', ['$resource', function($resource){
    return {
        multimedia: $resource('api/admin/multimedia', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        })
    }
}]);
services.factory('areasAdminService', ['$resource', function($resource){
    return {
        areas: $resource('api/admin/areas', {}, {
            query: { method: 'GET', isArray: false },
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray:false},
            delete: {method: 'DELETE', isArray: false}
        })
    }
}]);
services.factory('qaService', ['$resource', function($resource){
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

services.factory('ContractManagementService', ['$resource', function($resource){
    return {
        templates: $resource('api/admin/applications/contractManagement/templates', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        })
    }
}]);

services.factory('DPOCService', ['$resource', function($resource){
    return {
        devices: $resource('api/admin/applications/DPOC/devices', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        importDevices: $resource('api/admin/applications/DPOC/importDevices', {}, {
            create: { method: 'POST', isArray: false }
        })
    }
}]);