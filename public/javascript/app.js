var cloudAdminApp = angular.module('cloudAdminApp',
    [
        'ui.router',
        'cloudAdminControllers',
        'cloudAdminServices'

    ]);

cloudAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'partials/home.ejs'
        })
        .state('noutati', {
            //abstract: true,
            url: '/noutati/:articleType',
            templateUrl: 'partials/noutati/noutati.ejs',
            controller: 'ContentController'
        })
//        .state('noutati.articole',{
//            url: '/articole',
//            templateUrl: 'partials/noutati/articole.ejs'
//        })
//        .state('noutati.articoleLegislative',{
//            url: '/articoleLegislative',
//            templateUrl: 'partials/noutati/articoleLegislative.ejs'
//        })
        .state('biblioteca', {
            abstract: true,
            url: '/biblioteca',
            templateUrl: '/partials/biblioteca/biblioteca.ejs'
        })
        .state('biblioteca.produse',{
            url: '/produse',
            templateUrl: 'partials/biblioteca/produse.ejs',
            controller: 'therapeuticControllerCtrl'
//            controller: 'productsController'
        })
        .state('biblioteca.productDetails',{
            url: '/productDetails',
            templateUrl: 'partials/biblioteca/productDetails.ejs',
            controller: 'therapeuticControllerCtrl'
        })
        .state('biblioteca.scientificArticles',{
            url: '/scientificArticles',
            templateUrl: 'partials/biblioteca/scientificArticles.ejs'
        })
       .state('calendar',{
            url: '/calendar',
            templateUrl: 'partials/calendar.ejs'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/elearning/elearning.ejs'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/elearning/multimedia.ejs'
        })
        .state('elearning.transmisii',{
            url: '/transmisii',
            templateUrl: 'partials/elearning/transmisii.ejs'
        })
        .state('elearning.teste',{
            url: '/teste',
            templateUrl: 'partials/elearning/teste.ejs'
        })
        //utility state used for dev:
        .state('utility', {
            url: '/util',
            templateUrl: 'partials/utility.ejs',
            controller: 'ContentController'
        })
        //util_prod user for dev to create products
        .state('util_prod', {
            url: '/util_Products',
            templateUrl: 'partials/util_Products.ejs',
            controller: 'productsController'
        })
        //util_therapy user for dev to create products
        .state('util_therap', {
            url: '/util_Therapeutic',
            templateUrl: 'partials/util_Therapeutic.ejs',
            controller: 'therapeuticControllerCtrl'
        })
}]);

cloudAdminApp.run(
    [            '$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //amazon service paths
            $rootScope.pathAmazonResources = "https://s3-eu-west-1.amazonaws.com/msdapp/resources/";
            $rootScope.pathAmazonDev = "https://s3-eu-west-1.amazonaws.com/msddev-test/";
        }
    ]
);