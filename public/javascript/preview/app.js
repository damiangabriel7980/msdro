/**
 * Created by andrei.mirica on 24/08/16.
 */
var app = angular.module('app',
    [
        'ui.router',
        'controllers',
        'services',
        'ngAnimate'
    ]);

app.config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

app.constant('STATECONST', {
    'STAYWELLPRO': 'pro#!'
});

app.config(['$stateProvider', '$urlRouterProvider', 'STATECONST', function ($stateProvider, $urlRouterProvider, STATECONST) {
    $urlRouterProvider.otherwise("/");
    $urlRouterProvider
        .when(/resurse/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            $state.go('resurse', {articleType: parsedURL[2], articleId: parsedURL[4], searchTerm: null, urlPro : STATECONST.STAYWELLPRO + $match.input});
        }])
        .when(/pathologies/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            $state.go('pathologies', {pathology_id: parsedURL[1], urlPro : STATECONST.STAYWELLPRO + $match.input});
        }])
        .when(/groupSpecialProduct/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            $state.go('specialProducts', {product_id: parsedURL[1], menuId: parsedURL[3] ? parsedURL[3] : null, childId: parsedURL[4] ? parsedURL[4] : null, urlPro : STATECONST.STAYWELLPRO + $match.input});
        }]);
    $stateProvider
        .state('resurse', {
            url: '/resurse/despreMSD/:articleType/articol/:articleId/:searchTerm',
            controller: 'MainController',
            params : {
                urlPro : '',
                type : 'resource'
            },
            templateUrl : 'partials/preview/mainPreview.html'
        })
        .state('pathologies', {
            url: '/pathologies/:pathology_id',
            controller: 'MainController',
            params : {
                urlPro : '',
                type : 'pathology'
            },
            templateUrl : 'partials/preview/mainPreview.html'
        })
        .state('specialProducts', {
            url: '/groupSpecialProduct/:product_id/menuItem/:menuId/:childId',
            controller: 'MainController',
            params : {
                urlPro : '',
                type: 'product'
            },
            templateUrl : 'partials/preview/mainPreview.html'
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', 'Utils',
        function ($rootScope,   $state,   $stateParams,   Utils) {

            //amazon service paths
            $rootScope.amazonBucket = DEFAULT_AMAZON_BUCKET;
            $rootScope.pathAmazonDev = DEFAULT_AMAZON_PREFIX+$rootScope.amazonBucket+"/";

            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.defaultArticleHeaderImage = $rootScope.pathAmazonResources+"defaultArticleHeaderImage.png";

            $rootScope.trustAsHtml = Utils.trustAsHtml;
        }
    ]
);
