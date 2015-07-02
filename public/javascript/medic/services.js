var services = angular.module('services', ['ngResource']);

services.factory('ContentService', ['$resource', function($resource){
    return {
        content: $resource('api/content', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('SpecialFeaturesService', ['$resource', 'StorageService', function($resource, StorageService){
    return {
        SpecialGroups: $resource('api/specialFeatures/specialGroups', {}, {
            query: { method: 'GET', isArray: false }
        }),
        SpecialProducts: $resource('api/specialFeatures/groupSpecialProducts', {}, {
            query: { method: 'GET', isArray: false }
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
            query: { method: 'GET', isArray: false }
        }),
        Counties: $resource('api/counties/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        Cities: $resource('api/cities/:county_name', {}, {
            query: { method: 'GET', isArray: false }
        }),
        uploadProfile: $resource('api/userProfile/:newData', {}, {
            save: { method: 'POST'}
        }),
        saveUserPhoto: $resource('api/user/addPhoto',{},{
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
            query: { method: 'POST', isArray: false }
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