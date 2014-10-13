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
            templateUrl: 'partials/home.html'
        })
        .state('noutati', {
            abstract: true,
            url: '/noutati',
            templateUrl: 'partials/noutati/noutati.html'
        })
        .state('noutati.articole',{
            url: '/articole',
            templateUrl: 'partials/noutati/articole.html'
        })
        .state('noutati.articoleLegislative',{
            url: '/articoleLegislative',
            templateUrl: 'partials/noutati/articoleLegislative.html'
        })
        .state('biblioteca', {
            abstract: true,
            url: '/biblioteca',
            templateUrl: '/partials/biblioteca/biblioteca.html'
        })
        .state('biblioteca.produse',{
            url: '/produse',
            templateUrl: 'partials/biblioteca/produse.html'
        })
        .state('biblioteca.articoleStiintifice',{
            url: '/articoleStiintifice',
            templateUrl: 'partials/biblioteca/articoleStiintifice.html'
        })
        .state('biblioteca.manualMerck',{
            url: '/manualMerck',
            templateUrl: 'partials/biblioteca/manualMerck.html'
        })
        .state('calendar',{
            url: '/calendar',
            templateUrl: 'partials/calendar.html'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/elearning/elearning.html'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/elearning/multimedia.html'
        })
        .state('elearning.transmisii',{
            url: '/transmisii',
            templateUrl: 'partials/elearning/transmisii.html'
        })
        .state('elearning.teste',{
            url: '/teste',
            templateUrl: 'partials/elearning/teste.html'
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