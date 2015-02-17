var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return {
        getById: $resource('api/content/:content_id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getByType: $resource('api/content/type', {}, {
            query: { method: 'POST', isArray: true }
        })
    }
}]);

cloudAdminServices.factory('SpecialFeaturesService', ['$resource', function($resource){
    return {
        getSpecialGroups: $resource('api/groups/specialGroups', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getSpecialProducts: $resource('api/groupSpecialProducts', {}, {
            query: { method: 'POST', isArray: false }
        })
    }
}]);

cloudAdminServices.factory('specialProductService', ['$resource', function($resource){
    return {
        getSpecialProduct: $resource('api/specialProduct/', {}, {
            query: { method: 'POST', isArray: false }
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
        })
    }
}]);

cloudAdminServices.factory('ProfileService', ['$resource', function($resource){
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

cloudAdminServices.factory('HomeService', ['$resource', function($resource){
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

cloudAdminServices.factory('ProductService', ['$resource', function($resource){
    return {
        getAll: $resource('api/products/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByArea: $resource('api/products/productsByArea', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getSingle: $resource('api/products/:id', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

cloudAdminServices.factory('therapeuticAreaService', ['$resource', function($resource){
    return $resource('api/therapeutic_areas', {}, {
        query: { method: 'GET', isArray: true }
    });
}]);

cloudAdminServices.factory('multimediaService', ['$resource', function($resource){
    return {
        getByArea: $resource('api/multimedia/multimediaByArea', {}, {
            query: { method: 'POST', isArray: true }
        }),
        getSingle: $resource('api/multimedia2/:idd', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getSlides: $resource('api/slidesByMultimediaId/:multimedia_id', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

cloudAdminServices.factory('eventsService', ['$resource', function($resource){
    return $resource('api/calendar/getEvents/', {}, {
        query: { method: 'POST', isArray: true }
    });
}]);
cloudAdminServices.factory('eventsService2', ['$resource', function($resource){
    return $resource('api/calendar/:id', {}, {
        query: { method: 'GET', isArray: false }
    });
}]);

cloudAdminServices.factory('FormatService', function () {
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
cloudAdminServices.factory('quizesService', ['$resource', function($resource){
    return {
        getAll: $resource('api/quizes/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByQuiz: $resource('api/quizes/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getQuestions: $resource('api/quizes/:id/questions/:idd',{},{
            query: { method: 'GET', isArray: false }
        }),
        getMultimedia: $resource('api/multimediaBefore/:id',{},{
            query: { method: 'GET', isArray: false }
        })

    }
}]);
cloudAdminServices.factory('userService', ['$resource', function($resource){
    return {
        postTest: $resource('api/user',{},{
                save:{method:'PUT'}
            }
        )
    };
}]);