var app = angular.module('app',
    [
        'ui.router',
        'controllers',
        'services',
        'ngTable',
        'angularFileUpload',
        'ui.tinymce',
        'ui.select',
        'ja.qr',
        'ui.bootstrap.datetimepicker',
        'angular-growl',
        'myMultipleSelect',
        'therapeuticSelect',
        's3UploadManager'
    ]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
            templateUrl: 'partials/admin/utilizatori/conturiNoi/root.html',
            controller: 'NewAccountsController'
        })
        .state('utilizatori.conturiNoi.accepted',{
            url: '/accepted',
            templateUrl: 'partials/admin/utilizatori/conturiNoi/accepted.html',
            controller: 'UsersAcceptedController'
        })
        .state('utilizatori.conturiNoi.rejected',{
            url: '/rejected',
            templateUrl: 'partials/admin/utilizatori/conturiNoi/rejected.html',
            controller: 'UsersRejectedController'
        })
        .state('utilizatori.conturiNoi.pending',{
            url: '/pending',
            templateUrl: 'partials/admin/utilizatori/conturiNoi/pending.html',
            controller: 'UsersPendingController'
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
        .state('continut.specialProducts',{
            url: '/specialProducts',
            templateUrl: 'partials/admin/continut/specialProducts/viewAll.html',
            controller:'SpecialProductsController'
        })
        .state('continut.articole',{
            url: '/articole',
            templateUrl: 'partials/admin/continut/articole.html',
            controller:'Articles'
        })
        .state('continut.evenimente',{
            url: '/evenimente',
            templateUrl: 'partials/admin/continut/evenimente.html',
            controller:'eventsCtrl'
        })
        .state('continut.adaugaEveniment',{
            url: '/addEvent',
            templateUrl: 'partials/admin/continut/evenimenteAdd.ejs',
            controller:"eventsAddCtrl"
        })
        .state('continut.adaugaRoom',{
            url: '/addRoom',
            templateUrl: 'partials/admin/continut/roomAdd.ejs',
            controller:"roomAddCtrl"
        })
        .state('continut.updateRoom',{
            url: '/updateRoom/:id',
            templateUrl: 'partials/admin/continut/roomUpdate.ejs',
            controller:"roomUpdateCtrl"
        })

        .state('continut.adaugaConferinta',{
            url: '/addConference',
            templateUrl: 'partials/admin/continut/ConferenceAdd.ejs',
            controller:"ConferencesAddCtrl"
        })
        .state('continut.adaugaTalk',{
            url: '/addTalk',
            templateUrl: 'partials/admin/continut/TalkAdd.ejs',
            controller:"TalkAddCtrl"
        })
        .state('continut.adaugaSpeaker',{
            url: '/addSpeaker',
            templateUrl: 'partials/admin/continut/SpeakerAdd.ejs',
            controller:"SpeakerAddCtrl"
        })
        .state('continut.updateEveniment',{
            url: '/updateEvent/:id',
            templateUrl: 'partials/admin/continut/evenimenteUpdate.ejs',
            controller:"eventsUpdateCtrl"
        })
        .state('continut.updateConference',{
            url: '/updateConference/:id',
            templateUrl: 'partials/admin/continut/conferenceUpdate.ejs',
            controller:"conferenceUpdateCtrl"
        })
        .state('continut.updateTalk',{
            url: '/updateTalk/:id',
            templateUrl: 'partials/admin/continut/talkUpdate.ejs',
            controller:"talkUpdateCtrl"
        })
        .state('continut.updateSpeaker',{
            url: '/updateSpeaker/:id',
            templateUrl: 'partials/admin/continut/speakerUpdate.ejs',
            controller:"speakerUpdateCtrl"
        })
        .state('continut.intro',{
            url: '/intro',
            templateUrl: 'partials/admin/continut/intro.html'
        })
        .state('continut.carouselMedic',{
            url: '/carouselMedic',
            templateUrl: 'partials/admin/continut/carouselMedic/carouselMedic.html',
            controller: 'CarouselMedic'
        })
        .state('continut.carouselPublic',{
            url: '/carouselPublic',
            templateUrl: 'partials/admin/continut/carouselPublic/carouselPublic.html',
            controller: 'CarouselPublic'
        })
        .state('continut.continutPublic',{
            url: '/continutPublic',
            templateUrl: 'partials/admin/continut/continutPublic/continutPublic.html',
            controller: 'PublicContent'
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
                    backdrop: 'static',
                    keyboard: false,
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
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"testeAddCtrl"
                })
            }]
        })
        .state('ariiTerapeutice',{
            url: '/ariiTerapeutice',
            templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeutice.html',
            controller: 'TherapeuticAreas'
        })
        .state('ariiTerapeutice.adaugaArie',{
            parent:'ariiTerapeutice',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeuticeAdd.ejs',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"AddTherapeuticAreas"
                })
            }]
        })
        .state('ariiTerapeutice.editArie',{
            parent:'ariiTerapeutice',
            url: '/:id',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeuticeEdit.ejs',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"EditTherapeuticAreas"
                })
            }]
        })
        .state('ariiTerapeutice.deleteArie',{
            parent:'ariiTerapeutice',
            url: '/deleteArea/:id',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/ariiTerapeutice/ariiTerapeuticeDelete.html',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"ariiTerapeuticeDeleteCtrl"
                })
            }]
        })
        .state('applications', {
            abstract: true,
            url: '/applications',
            templateUrl: '/partials/admin/applications/applications.html'
        })
        .state('applications.qa',{
            url: '/qa',
            templateUrl: 'partials/admin/applications/qa/qa.html',
            controller: 'qaController'
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', '$modal',
        function ($rootScope,   $state,   $stateParams, $modal) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //amazon service paths
            $rootScope.amazonBucket = sessionStorage.defaultAmazonBucket;
            $rootScope.pathAmazonDev = "https://s3-eu-west-1.amazonaws.com/"+$rootScope.amazonBucket+"/";

            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";
            $rootScope.defaultFileImage = $rootScope.pathAmazonResources+"file.png";
        }
    ]
);