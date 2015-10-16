var services = angular.module('services', ['ngResource']);

services.factory('ContentService', ['$resource', function($resource){
    return {
        content: $resource('api/content', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('SpecialFeaturesService', ['$resource', '$rootScope', 'StorageService', '$q', 'Success', 'Error', 'CollectionsService', function($resource, $rootScope, StorageService, $q, Success, Error, CollectionsService){
    var getSpecialGroups = function (id) {
        var deferred = $q.defer();
        var query = {};
        if(id) query._id = id;
        $resource('api/specialFeatures/specialGroups', {}, {
            query: { method: 'GET', isArray: false }
        }).query(query).$promise
            .then(function (resp) {
                deferred.resolve(Success.getObject(resp));
            })
            .catch(function () {
                deferred.reject({});
            });
        return deferred.promise;
    };
    var setSpecialGroup = function (id) {
        StorageService.local.setElement("selectedGroup", id || "");
    };
    var getSpecialGroup = function () {
        var deferred = $q.defer();
        getSpecialGroups().then(
            function (groups) {
                groups = groups || [];
                var selectedGroup = StorageService.local.getElement("selectedGroup") || "0";
                var found = CollectionsService.findById(selectedGroup, groups);
                if(found){
                    deferred.resolve(found);
                }else{
                    //something must have changed in groups config
                    //set special group to first available in list; if list is empty set it null
                    if(groups[0]){
                        setSpecialGroup(groups[0]._id);
                        deferred.resolve(groups[0]);
                    }else{
                        deferred.resolve();
                    }
                }
            },
            function (err) {
                deferred.reject(Error.getMessage(err));
            }
        );
        return deferred.promise;
    };
    return {
        SpecialProducts: $resource('api/specialFeatures/groupSpecialProducts', {}, {
            query: { method: 'GET', isArray: false }
        }),
        specialApps: $resource('api/specialFeatures/specialApps', {}, {
            query: { method: 'GET', isArray: false }
        }),
        defaultPharma: $resource('api/defaultPharma', {}, {
            query: { method: 'GET', isArray: false }
        }),
        specialGroups: {
            getAll: getSpecialGroups,
            getSelected: getSpecialGroup,
            setSelected: setSpecialGroup
        }
    }
}]);
services.factory("IntroService", ['$resource', 'StorageService', function ($resource, StorageService) {
    return {
        hideNextTime: {
            getStatus: function (groupID) {
                var viewStatus = StorageService.local.getElement("introHideNextTime") || {};
                if(groupID){
                    return viewStatus[groupID];
                }else{
                    return viewStatus;
                }
            },
            setStatus: function (groupID, value) {
                var statusViews = StorageService.local.getElement("introHideNextTime") || {};
                statusViews[groupID] = value;
                StorageService.local.setElement("introHideNextTime", statusViews);
            },
            resetStatus: function () {
                StorageService.local.removeElement("introHideNextTime");
            }
        },
        checkIntroEnabled: $resource('api/checkIntroEnabled/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        rememberIntroView: $resource('api/rememberIntroView', {}, {
            query: { method: 'GET', isArray: false },
            save: { method: 'POST', isArray: false }
        }),
        presentation: $resource('api/introPresentation', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('specialProductService', ['$resource', function($resource){
    return {
        SpecialProduct: $resource('api/specialProduct', {}, {
            query: { method: 'GET', isArray: false }
        }),
        SpecialProductMenu: $resource('api/specialProductMenu', {}, {
            query: { method: 'GET', isArray: false }
        }),
        SpecialProductDescription: $resource('api/specialProductDescription', {}, {
            query: { method: 'GET', isArray: false }
        }),
        SpecialProductFiles: $resource('api/specialProductFiles', {}, {
            query: { method: 'POST', isArray: false }
        }),
        SpecialProductGlossary: $resource('api/specialProductGlossary', {}, {
            query: { method: 'GET', isArray: false }
        }),
        speakers: $resource('api/specialProduct/speakers/', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('ProfileService', ['$resource', function($resource){
    return {
        UserData: $resource('api/userdata/', {}, {
            query: { method: 'GET', isArray: false },
            save:  { method: 'PUT', isArray: false}
        }),
        Counties: $resource('api/counties/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        Cities: $resource('api/cities', {}, {
            query: { method: 'GET', isArray: false }
        }),
        saveUserPhoto: $resource('api/user/addPhoto',{},{
            save: {method:'POST'}
        }),
        uploadJob: $resource('api/userJob', {}, {
            save: { method: 'POST'}
        }),
        changeEmail: $resource('api/changeEmail', {}, {
            save: { method: 'POST'}
        }),
        changePassword: $resource('api/changePassword', {}, {
            save: { method: 'POST'}
        })
    }
}]);

services.factory('CoursesService', ['$resource', function($resource){
    return {
        courses: $resource('api/elearning/courses', {}, {
            query: { method: 'GET', isArray: false }
        }),
        slides: $resource('api/elearning/slides', {}, {
            query: { method: 'GET', isArray: false },
            save: {method: 'POST', isArray: false}
        }),
        subchapters: $resource('api/elearning/subchapters', {}, {
            query: { method: 'GET', isArray: false }
        })

    }
}]);

services.factory('HomeService', ['$resource', function($resource){
    return {
        events: $resource('api/userHomeEvents/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        news: $resource('api/homeNews', {}, {
            query: { method: 'GET', isArray: false }
        }),
        multimedia: $resource('api/userHomeMultimedia/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        carousel: $resource('api/userHomeCarousel/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getSearchResults: $resource('api/userHomeSearch/', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('ProductService', ['$resource', function($resource){
    return {
        products: $resource('api/products', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('multimediaService', ['$resource', function($resource){
    return {
        multimedia: $resource('api/multimedia', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('eventsService', ['$resource', function($resource){
    return {
        calendar: $resource('api/calendar', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('FormatService', function () {
    return {
        formatMongoDate: function (date) {
            var d = date.substring(0,10).split('-');
            if(d.length == 3){
                return d[2]+"/"+d[1]+"/"+d[0];
            }else{
                return null;
            }
        }
    }
});

services.factory('CameraService', function($window) {

    var getUserMediaAV = function(successFn, errorFn) {
        navigator.getUserMedia = ($window.navigator.getUserMedia ||
        $window.navigator.webkitGetUserMedia ||
        $window.navigator.mozGetUserMedia ||
        $window.navigator.msGetUserMedia);
        return navigator.getUserMedia({
            video: true,
            audio: true
        },successFn, errorFn);
    };

    var getUserMediaAOnly = function(succcesFn,errorFn) {
        navigator.getUserMedia = ($window.navigator.getUserMedia ||
        $window.navigator.webkitGetUserMedia ||
        $window.navigator.mozGetUserMedia ||
        $window.navigator.msGetUserMedia);
        return navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "true",
                        "googAutoGainControl": "true",
                        "googNoiseSuppression": "true",
                        "googHighpassFilter": "true"
                    },
                    "optional": []
                },
                "video": true
            }, succcesFn, errorFn);
    };

    var volumeAudioProcess = function( event ) {
        var buf = event.inputBuffer.getChannelData(0);
        var bufLength = buf.length;
        var sum = 0;
        var x;

        // Do a root-mean-square on the samples: sum up the squares...
        for (var i=0; i<bufLength; i++) {
            x = buf[i];
            if (Math.abs(x)>=this.clipLevel) {
                this.clipping = true;
                this.lastClip = window.performance.now();
            }
            sum += x * x;
        }

        // ... then take the square root of the sum.
        var rms =  Math.sqrt(sum / bufLength);

        // Now smooth this out with the averaging factor applied
        // to the previous sample - take the max here because we
        // want "fast attack, slow release."
        this.volume = Math.max(rms, this.volume*this.averaging);
    };

    var createAudioMeter = function(audioContext,clipLevel,averaging,clipLag) {
        var processor = audioContext.createScriptProcessor(512);
        processor.onaudioprocess = volumeAudioProcess;
        processor.clipping = false;
        processor.lastClip = 0;
        processor.volume = 0;
        processor.clipLevel = clipLevel || 0.98;
        processor.averaging = averaging || 0.98;
        processor.clipLag = clipLag || 250;

        // this will have no effect, since we don't copy the input to the output,
        // but works around a current Chrome bug.
        processor.connect(audioContext.destination);

        processor.checkClipping =
            function(){
                if (!this.clipping)
                    return false;
                if ((this.lastClip + this.clipLag) < window.performance.now())
                    this.clipping = false;
                return this.clipping;
            };

        processor.shutdown =
            function(){
                this.disconnect();
                this.onaudioprocess = null;
            };

        return processor;
    };

    return {
        getUserMediaAOnly: getUserMediaAOnly,
        getUserMediaAV : getUserMediaAV,
        volumeAudioProcess: volumeAudioProcess,
        createAudioMeter: createAudioMeter
    }
});