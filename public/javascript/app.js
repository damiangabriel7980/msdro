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
            abstract: true,
            url: '/noutati',
            templateUrl: 'partials/noutati/noutati.ejs'
        })
        .state('noutati.articole',{
            url: '/articole',
            templateUrl: 'partials/noutati/articole.ejs'
        })
        .state('noutati.articoleLegislative',{
            url: '/articoleLegislative',
            templateUrl: 'partials/noutati/articoleLegislative.ejs'
        })
        .state('biblioteca', {
            abstract: true,
            url: '/biblioteca',
            templateUrl: '/partials/biblioteca/biblioteca.ejs'
        })
        .state('biblioteca.produse',{
            url: '/produse',
            templateUrl: 'partials/biblioteca/produse.ejs',
            controller: 'therapeuticControllerCtrl'
        })
        .state('biblioteca.productDetails',{
            url: '/productDetails',
            templateUrl: 'partials/biblioteca/productDetails.ejs',
            controller: 'therapeuticControllerCtrl'
        })
        .state('biblioteca.articoleStiintifice',{
            url: '/articoleStiintifice',
            templateUrl: 'partials/biblioteca/articoleStiintifice.ejs'
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
        }
    ]
);