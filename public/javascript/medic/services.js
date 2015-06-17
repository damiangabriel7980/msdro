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
services.factory('alterIntroService', ['$resource', function($resource){
    return {
        alterIntro: $resource('api/alterIntroSession', {}, {
            query: { method: 'GET', isArray: false },
            save: {method: 'POST', isArray: false}
        }),
        getDefaultGroupID: $resource('api/getDefaultGroupID/', {}, {
            query: { method: 'POST', isArray: false }
        }),
        checkIntroEnabled:$resource('api/checkIntroEnabled/', {}, {
            query: { method: 'POST', isArray: false }
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

services.factory('PresentationService', ['$resource', function($resource){
    return {
        getUserHomeModal: $resource('api/userHomeModalPresentation/', {}, {
            query: { method: 'POST', isArray: false }
        }),
        saveOption: $resource('api/changeUserModalStatus', {}, {
            query: { method: 'POST', isArray: false }
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
        getByArea: $resource('api/multimedia/multimediaByArea', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getSingle: $resource('api/multimedia2/:idMultimedia', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getSlides: $resource('api/slidesByMultimediaId/:multimedia_id', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

services.factory('eventsService', ['$resource', function($resource){
    return $resource('api/calendar/getEvents/', {}, {
        query: { method: 'POST', isArray: true }
    });
}]);
services.factory('eventsService2', ['$resource', function($resource){
    return $resource('api/calendar/:id', {}, {
        query: { method: 'GET', isArray: false }
    });
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
services.factory('userService', ['$resource', function($resource){
    return {
        postTest: $resource('api/user',{},{
                save:{method:'PUT'}
            }
        )
    };
}]);