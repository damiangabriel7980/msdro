var cloudAdminApp = angular.module('cloudAdminApp',
    [
        'ui.router',
        'cloudAdminControllers',
        'cloudAdminServices',
        'ngTable'
    ]);

cloudAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/utilizatori/gestionareConturi");
    $stateProvider
        .state('utilizatori', {
            abstract: true,
            url: '/utilizatori',
            templateUrl: 'partials/admin/utilizatori/utilizatori.html'
        })
        .state('utilizatori.gestionareConturi',{
            url: '/gestionareConturi',
            templateUrl: 'partials/admin/utilizatori/gestionareConturi.html'
        })
        .state('utilizatori.conturiNoi',{
            url: '/conturiNoi',
            templateUrl: 'partials/admin/utilizatori/conturiNoi.html'
        })
        .state('utilizatori.grupuri',{
            url: '/grupuri',
            templateUrl: 'partials/admin/utilizatori/grupuri.html',
            controller: 'GrupuriController'
        })
        .state('utilizatori.importUsers',{
            url: '/importUsers',
            templateUrl: 'partials/admin/utilizatori/importUsers.html'
        })
        .state('continut', {
            abstract: true,
            url: '/continut',
            templateUrl: '/partials/admin/continut/continut.html'
        })
        .state('continut.produse',{
            url: '/produse',
            templateUrl: 'partials/admin/continut/produse.html',
            controller:'productsCtrl'
        })
        .state('continut.produse.adaugaProdus',{
            parent:'continut.produse',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/continut/productsAdd.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"productsAddCtrl"
                })
            }]
        })
        .state('continut.articole',{
            url: '/articole',
            templateUrl: 'partials/admin/continut/articole.html',
            controller:'articlesCtrl'
        })
        .state('continut.articole.adaugaArticol',{
            parent:'continut.articole',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/continut/articoleAdd.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"articlesAddCtrl"
                })
            }]
        })
        .state('continut.evenimente',{
            url: '/evenimente',
            templateUrl: 'partials/admin/continut/evenimente.html',
            controller:'eventsCtrl'
        })
        .state('continut.evenimente.adaugaEveniment',{
            parent:'continut.evenimente',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/continut/evenimenteAdd.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"eventsAddCtrl"
                })
            }]
        })
        .state('continut.indexareContinut',{
            url: '/indexareContinut',
            templateUrl: 'partials/admin/continut/indexareContinut.html'
        })
        .state('continut.intro',{
            url: '/intro',
            templateUrl: 'partials/admin/continut/intro.html'
        })
        .state('continut.carouselMedic',{
            url: '/carouselMedic',
            templateUrl: 'partials/admin/continut/carouselMedic.html'
        })
        .state('continut.carouselPublic',{
            url: '/carouselPublic',
            templateUrl: 'partials/admin/continut/produse.html'
        })
        .state('continut.continutPublic',{
            url: '/continutPublic',
            templateUrl: 'partials/admin/continut/continutPublic.html'
        })
        .state('newsletter', {
            abstract: true,
            url: '/newsletter',
            templateUrl: '/partials/admin/newsletter/newsletter.html'
        })
        .state('newsletter.consolaNewsletter',{
            url: '/consolaNewsletter',
            templateUrl: 'partials/admin/newsletter/consolaNewsletter.html'
        })
        .state('newsletter.rapoarteUtilizare',{
            url: '/rapoarteUtilizare',
            templateUrl: 'partials/admin/newsletter/rapoarteUtilizare.html'
        })
        .state('newsletter.rapoarteGlobale',{
            url: '/rapoarteGlobale',
            templateUrl: 'partials/admin/newsletter/rapoarteGlobale.html'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/admin/elearning/elearning.html'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/admin/elearning/multimedia.html',
            controller: 'multimediaCtrl'
        })
        .state('elearning.multimedia.adaugaMultimedia',{
            parent:'elearning.multimedia',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/elearning/multimediaAdd.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"multimediaAddCtrl"
                })
            }]
        })
        .state('elearning.transmisiiLive',{
            url: '/transmisiiLive',
            templateUrl: 'partials/admin/elearning/transmisiiLive.html'
        })
        .state('elearning.testeInteractive',{
            url: '/testeInteractive',
            templateUrl: 'partials/admin/elearning/testeInteractive.html',
            controller: 'testeInteractiveCtrl'
        })
        .state('elearning.testeInteractive.adaugaTest',{
            parent:'elearning.testeInteractive',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/elearning/testeInteractiveAdd.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"testeAddCtrl"
                })
            }]
        })
        .state('ariiTerapeutice',{
            url: '/ariiTerapeutice',
            templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeutice.html',
            controller: 'ariiTerapeuticeCtrl'
        })
        .state('ariiTerapeutice.adaugaArie',{
            parent:'ariiTerapeutice',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeuticeAdd.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"ariiTerapeuticeAddCtrl"
                })
            }]
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