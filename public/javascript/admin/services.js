var services = angular.module('services', ['ngResource']);
services.factory('AmazonService', ['$resource', '$rootScope', 'Success', function($resource, $rootScope, Success){
    var getCredentialsFromServer = $resource('api/admin/s3tc', {}, {
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

services.factory('VersionService', ['$resource', function($resource){
    return $resource('api/admin/appVersion', {}, {
        query: { method: 'GET', isArray: false }
    })
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

services.factory('ElearningService', ['$resource', function($resource){
    return {
        courses: $resource('api/admin/courses', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        chapters: $resource('api/admin/chapters', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        subchapters: $resource('api/admin/subchapters', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        slides: $resource('api/admin/slides', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
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

services.factory('JanuviaService', ['$resource', function($resource){
    return {
        users: $resource('api/admin/applications/januvia/users', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        user_types: $resource('api/admin/applications/januvia/user_types', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('LocationService', ['$resource', function($resource){
    return {
        counties: $resource('api/admin/location/counties', {}, {
            query: { method: 'GET', isArray: false }
        }),
        cities: $resource('api/admin/location/cities', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('ApplicationService',['$resource',function($resource){
    return{
        app :$resource('api/admin/applications/edit',{},{
            query:{method:'GET',isArray: false},
            create:{method:'POST', isArray:false},
            update:{method:'PUT', isArray:false},
            delete:{method:'DELETE', isArray:false}
        })
    }
}])

services.factory('NewsletterService', ['$resource', function($resource){
    var variableTypes = ["text", "html"];
    var systemVariables = ["UNSUBSCRIBE_URL"];
    var getVariableType = function (variableName, variables) {
        for(var i=0; i<variables.length; i++){
            if(variables[i] && variables[i].name === variableName){
                return variables[i].type;
            }
        }
        return null;
    };
    var parseTemplateVariables = function (html, initialVariables) {
        var matches = html.match(/\*\|[a-zA-Z0-9_]{0,100}\|\*/g);
        var variables = [];
        var variable;
        if(matches){
            for(var i=0; i<matches.length; i++){
                variable = matches[i].replace(/\|/g,"").replace(/\*/g,"");
                if(variable && systemVariables.indexOf(variable) === -1){
                    variables.push({
                        name: variable,
                        type: getVariableType(variable, initialVariables)
                    });
                }
            }
        }
        return variables;
    };
    var renderTemplate = function (templateHtml, variables) {
        templateHtml = templateHtml || "";
        for(var i=0; i<variables.length; i++){
            if(variables[i] && ["text", "html"].indexOf(variables[i].type) > -1 && variables[i].value){
                templateHtml = templateHtml.replace(new RegExp("\\*\\|"+variables[i].name+"\\|\\*", "g"), variables[i].value);
            }
        }
        return templateHtml;
    };
    var sanitizeStats = function(stats){
        return {
            "trimise": stats.sent,
            "netrimise": stats.soft_bounces,
            "adrese nevalide": stats.hard_bounces,
            "vizualizari": stats.opens,
            "vizualizari unice": stats.unique_opens,
            "accesari": stats.clicks,
            "acesari unice": stats.unique_clicks
            //"plangeri": stats.complaints
        };
    };
    return {
        campaigns: $resource('api/admin/newsletter/campaigns', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        distributionLists: $resource('api/admin/newsletter/distribution_lists', {}, {
            query: { method: 'GET', isArray: false },
            create: { method: 'POST', isArray: false },
            update: { method: 'PUT', isArray: false },
            delete: { method: 'DELETE', isArray: false }
        }),
        templates: {
            api: $resource('api/admin/newsletter/templates', {}, {
                query: { method: 'GET', isArray: false },
                create: { method: 'POST', isArray: false },
                update: { method: 'PUT', isArray: false },
                delete: { method: 'DELETE', isArray: false }
            }),
            parseVariables: parseTemplateVariables,
            renderTemplate: renderTemplate,
            variableTypes: variableTypes,
            systemVariables: systemVariables
        },
        users: $resource('api/admin/newsletter/users', {}, {
            query: { method: 'GET', isArray: false }
        }),
        unsubscribedEmails: $resource('api/admin/newsletter/unsubscribedEmails', {}, {
            query: { method: 'GET', isArray: false }
        }),
        statistics: {
            api: $resource('api/admin/newsletter/statistics', {}, {
                query: { method: 'GET', isArray: false }
            }),
            sanitize: sanitizeStats
        }
    }
}]);

services.factory('CSVParser', ['$q', function ($q) {
    var parseContent = function (contents, headers, separator) {
        console.log(contents);
        //CSV config
        separator = separator || ",";
        //var headers = ["name", "email"];

        //init variables
        var headerPatts = [];
        for(var h=0; h<headers.length; h++){
            headerPatts.push(new RegExp("^"+headers[h]));
        }
        var columnsCount = headerPatts.length;

        //handle errors
        var parseError = function (err) {
            return {
                error: err
            };
        };

        //begin parse
        var lines = contents.split("\n");
        console.log(lines);
        if(lines && lines[0]){
            var result = [];
            var linesUnprocessed = [];
            for(var i=0; i<lines.length; i++){
                //get line
                var line = lines[i].split(separator);
                //check line length
                if(line.length != columnsCount && i!=0) {
                    if(lines[i] != "") linesUnprocessed.push(lines[i]);
                }else if(i==0){
                    //check headers
                    console.log(line);
                    console.log(headerPatts);
                    for(var j=0; j<headerPatts.length; j++){
                        if(!headerPatts[j].test(line[j])) {
                            return parseError("headers");
                        }
                    }
                }else{
                    //add to result
                    var lineObj = {};
                    for(var l=0; l < columnsCount; l++){
                        lineObj[headers[l]] = line[l];
                    }
                    result.push(lineObj);
                }
            }
            return {
                headers: headers,
                body: result,
                unprocessed: linesUnprocessed,
                columns: columnsCount
            };
        }else{
            return parseError("lines");
        }
    };
    var getContent = function (file) {
        var deferred = $q.defer();
        var r = new FileReader();
        r.onload = function(e) {
            deferred.resolve(e.target.result);
        };
        r.readAsText(file);
        return deferred.promise;
    };
    var parseCSV = function (file, headers, separator) {
        var deferred = $q.defer();
        getContent(file).then(function (content) {
            deferred.resolve(parseContent(content, headers, separator));
        });
        return deferred.promise;
    };
    return {
        parse: parseCSV
    };
}]);