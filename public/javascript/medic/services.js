var services = angular.module('services', ['ngResource']);

services.factory('ContentService', ['$resource', function($resource){
    return {
        getById: $resource('api/content/articleDetails', {}, {
            query: { method: 'POST', isArray: false }
        }),
        getByType: $resource('api/content/type', {}, {
            query: { method: 'POST', isArray: true }
        })
    }
}]);

services.factory('SpecialFeaturesService', ['$resource', 'StorageService', function($resource, StorageService){
    return {
        getSpecialGroups: $resource('api/specialFeatures/specialGroups', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getSpecialProducts: $resource('api/specialFeatures/groupSpecialProducts', {}, {
            query: { method: 'POST', isArray: true }
        }),
        specialApps: $resource('api/specialFeatures/specialApps', {}, {
            query: { method: 'GET', isArray: false }
        }),
        specialGroups: {
            getSelected: function () {
                return StorageService.local.getElement("selectedGroup");
            },
            setSelected: function (value) {
                StorageService.local.setElement("selectedGroup", value);
            }
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
        getSpecialProduct: $resource('api/specialProduct/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getSpecialProductMenu: $resource('api/specialProductMenu/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getSpecialProductDescription: $resource('api/specialProductDescription/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getSpecialProductFiles: $resource('api/specialProductFiles/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getSpecialProductGlossary: $resource('api/specialProductGlossary/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        speakers: $resource('api/specialProduct/speakers/', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('ProfileService', ['$resource', function($resource){
    return {
        getUserData: $resource('api/userdata/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getCounties: $resource('api/counties/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getCities: $resource('api/cities/:county_name', {}, {
            query: { method: 'GET', isArray: true }
        }),
        uploadProfile: $resource('api/userProfile/:newData', {}, {
            save: { method: 'POST'}
        }),
        saveUserPhoto: $resource('api/user/addPhoto/:data',{},{
            save: {method:'POST'}
        }),
        uploadJob: $resource('api/userJob/:job', {}, {
            save: { method: 'POST'}
        }),
        changeEmail: $resource('api/changeEmail/:userData', {}, {
            save: { method: 'POST'}
        }),
        changePassword: $resource('api/changePassword/:userData', {}, {
            save: { method: 'POST'}
        })
    }
}]);

services.factory('HomeService', ['$resource', function($resource){
    return {
        getUserEvents: $resource('api/userHomeEvents/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getUserNews: $resource('api/userHomeNews', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getUserScientificNews: $resource('api/userHomeScientific', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getUserMultimedia: $resource('api/userHomeMultimedia/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getCarousel: $resource('api/userHomeCarousel/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getSearchResults: $resource('api/userHomeSearch/', {}, {
            query: { method: 'POST', isArray: false }
        }),
        getUserImage: $resource('api/userImage/', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('ProductService', ['$resource', function($resource){
    return {
        getAll: $resource('api/products/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByArea: $resource('api/products/productsByArea', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getSingle: $resource('api/productsDetails', {}, {
            query: { method: 'POST', isArray: false }
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