/**
 * Created by andreimirica on 09.11.2015.
 */
var services = angular.module('services', ['ngResource']);
services.factory('AmazonService', ['$resource', '$rootScope', 'Success', function($resource, $rootScope, Success){
    var getCredentialsFromServer = $resource('api/streamAdmin/s3tc', {}, {
        query: { method: 'GET', isArray: false }
    });
    var getClient = function (callback) {
        getCredentialsFromServer.query().$promise.then(function (resp) {
            var credentials = Success.getObject(resp).Credentials;
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

services.factory('liveConferences', ['$resource', function($resource){
    return $resource('api/streamAdmin/liveConferences', {}, {
        query: { method: 'GET', isArray: false },
        update: { method: 'PUT', isArray: false},
        create: { method: 'POST', isArray: false},
        delete: { method: 'DELETE', isArray: false}
    })
}]);

services.factory('userService', ['$resource', function($resource){
    return {
        users: $resource('api/streamAdmin/users', {}, {
            query: { method: 'GET', isArray: false }
        }) ,
        groups: $resource('api/streamAdmin/groups', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('getIds', [function () {
    var extract = function (array){
        var ids = [];
        for(var i = 0; i < array.length; i++)
        {
            if(array[i]._id != null)
                ids.push(array[i]._id)
        }
        return ids;
    };
    return {
        extract : extract
    }
}]);

services.factory('therapeuticAreaService', ['$resource', function($resource){
    return $resource('api/streamAdmin/therapeutic_areas', {}, {
        query: { method: 'GET', isArray: false }
    });
}]);

services.factory('filterArrayProperty', [function () {
    var getData = function (mainArray,property,propName,textToSearch){
        var data = [];
        angular.forEach(mainArray, function(item) {
            angular.forEach(item[property], function(itemProp) {
                if( itemProp[propName].toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0 )
                    data.push(item);
            });
        });
        return data;
    };
    return {
        getData : getData
    }
}]);
