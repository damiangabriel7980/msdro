var cloudAdminApp = angular.module('cloudAdminApp',
    [
        'ui.router',
        'cloudAdminControllers',
        'cloudAdminServices'
    ]);

cloudAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('utilizatori', {
            abstract: true,
            url: '/utilizatori',
            templateUrl: 'partials/admin/utilizatori/utilizatori.ejs',
            controller: 'UsersController'
        })
        .state('utilizatori.gestionareConturi',{
            url: '/gestionareConturi',
            templateUrl: 'partials/admin/utilizatori/gestionareConturi.ejs'
        })
        .state('utilizatori.conturiNoi',{
            url: '/conturiNoi',
            templateUrl: 'partials/admin/utilizatori/conturiNoi.ejs',
            controller: 'ConturiNoiController'
        })
        .state('utilizatori.grupuri',{
            url: '/grupuri',
            templateUrl: 'partials/admin/utilizatori/grupuri.ejs',
            controller: 'GrupuriController'
        })
        .state('utilizatori.importUsers',{
            url: '/importUsers',
            templateUrl: 'partials/admin/utilizatori/importUsers.ejs',
            controller: 'ImportUsersController'
        })
        .state('continut', {
            abstract: true,
            url: '/continut',
            templateUrl: '/partials/admin/continut/continut.ejs'
        })
        .state('continut.produse',{
            url: '/produse',
            templateUrl: 'partials/admin/continut/produse.ejs',
            controller: 'ProduseController'
        })
        .state('continut.articole',{
            url: '/articole',
            templateUrl: 'partials/admin/continut/articole.ejs',
            controller: 'ArticoleController'
        })
        .state('continut.evenimente',{
            url: '/evenimente',
            templateUrl: 'partials/admin/continut/evenimente.ejs',
            controller: 'EvenimenteController'
        })
        .state('continut.indexareContinut',{
            url: '/indexareContinut',
            templateUrl: 'partials/admin/continut/indexareContinut.ejs',
            controller: 'IndexareContinutController'
        })
        .state('continut.intro',{
            url: '/intro',
            templateUrl: 'partials/admin/continut/intro.ejs',
            controller: 'IntroController'
        })
        .state('continut.carouselMedic',{
            url: '/carouselMedic',
            templateUrl: 'partials/admin/continut/carouselMedic.ejs',
            controller: 'CarouselMedicController'
        })
        .state('continut.carouselPublic',{
            url: '/carouselPublic',
            templateUrl: 'partials/admin/continut/produse.ejs',
            controller: 'ProduseController'
        })
        .state('continut.continutPublic',{
            url: '/continutPublic',
            templateUrl: 'partials/admin/continut/continutPublic.ejs',
            controller: 'ContinutPublicController'
        })
        .state('newsletter', {
            abstract: true,
            url: '/newsletter',
            templateUrl: '/partials/admin/newsletter/newsletter.ejs'
        })
        .state('newsletter.consolaNewsletter',{
            url: '/consolaNewsletter',
            templateUrl: 'partials/admin/newsletter/consolaNewsletter.ejs',
            controller: 'ConsolaNewsletterController'
        })
        .state('newsletter.rapoarteUtilizare',{
            url: '/rapoarteUtilizare',
            templateUrl: 'partials/admin/newsletter/rapoarteUtilizare.ejs',
            controller: 'RapoarteUtilizareController'
        })
        .state('newsletter.rapoarteGlobale',{
            url: '/rapoarteGlobale',
            templateUrl: 'partials/admin/newsletter/rapoarteGlobale.ejs',
            controller: 'RapoarteGlobaleController'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/admin/elearning/elearning.ejs'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/admin/elearning/multimedia.ejs',
            controller: 'MultimediaController'
        })
        .state('elearning.transmisiiLive',{
            url: '/transmisiiLive',
            templateUrl: 'partials/admin/elearning/transmisiiLive.ejs',
            controller: 'TransmisiiLiveController'
        })
        .state('elearning.testeInteractive',{
            url: '/testeInteractive',
            templateUrl: 'partials/admin/elearning/testeInteractive.ejs',
            controller: 'TesteInteractiveController'
        })
        .state('ariiTerapeutice',{
            url: '/ariiTerapeutice',
            templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeutice.ejs',
            controller: 'AriiTerapeuticeController'
        })

}]);

cloudAdminApp.run(
    [            '$rootScope', '$state', '$stateParams', '$modal',
        function ($rootScope,   $state,   $stateParams, $modal) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //amazon service paths
            //pathAmazonDev needs to be changed in production
            $rootScope.pathAmazonDev = "https://s3-eu-west-1.amazonaws.com/msddev-test/";
            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";
        }
    ]
);