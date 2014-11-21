var cloudAdminServices = angular.module('cloudAdminServices', ['ngResource']);

cloudAdminServices.factory('ContentService', ['$resource', function($resource){
    return {
        getById: $resource('api/content/:content_id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getByType: $resource('api/content/type/:content_type', {}, {
            query: { method: 'GET', isArray: true }
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
            query: { method: 'GET', isArray: true }
        }),
        getUserNews: $resource('api/userHomeNews/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getUserScientificNews: $resource('api/userHomeScientific/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getUserMultimedia: $resource('api/userHomeMultimedia/', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);

cloudAdminServices.factory('ProductService', ['$resource', function($resource){
    return {
        getAll: $resource('api/products/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByArea: $resource('api/products/productsByArea/:id', {}, {
            query: { method: 'GET', isArray: true }
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
        getByArea: $resource('api/multimedia/multimediaByArea/:id', {}, {
            query: { method: 'GET', isArray: true }
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
    return $resource('api/calendar/', {}, {
        query: { method: 'GET', isArray: true }
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
cloudAdminServices.factory('testeService', ['$resource', function($resource){
    return {
        getAll: $resource('api/teste/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getByTest: $resource('api/teste/:id', {}, {
            query: { method: 'GET', isArray: false }
        }),
        getQ: $resource('api/teste/:id/questions/:idd',{},{
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