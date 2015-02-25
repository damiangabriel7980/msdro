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
    $urlRouterProvider.otherwise("/users/manageAccounts");
    $stateProvider
        .state('users', {
            abstract: true,
            url: '/users',
            templateUrl: 'partials/admin/users/root.html'
        })
        .state('users.manageAccounts',{
            url: '/manageAccounts',
            templateUrl: 'partials/admin/users/manageAccounts.html'
        })
        .state('users.newAccounts',{
            url: '/newAccounts',
            templateUrl: 'partials/admin/users/newAccounts/root.html',
            controller: 'NewAccounts'
        })
        .state('users.newAccounts.accepted',{
            url: '/accepted',
            templateUrl: 'partials/admin/users/newAccounts/accepted.html',
            controller: 'UsersAccepted'
        })
        .state('users.newAccounts.rejected',{
            url: '/rejected',
            templateUrl: 'partials/admin/users/newAccounts/rejected.html',
            controller: 'UsersRejected'
        })
        .state('users.newAccounts.pending',{
            url: '/pending',
            templateUrl: 'partials/admin/users/newAccounts/pending.html',
            controller: 'UsersPending'
        })
        .state('users.groups',{
            url: '/groups',
            templateUrl: 'partials/admin/users/groups/root.html',
            controller: 'Groups'
        })
        .state('users.importUsers',{
            url: '/importUsers',
            templateUrl: 'partials/admin/users/importUsers.html'
        })
        .state('content', {
            abstract: true,
            url: '/content',
            templateUrl: '/partials/admin/content/root.html'
        })
        .state('content.produse',{
            url: '/produse',
            templateUrl: 'partials/admin/content/products/root.html',
            controller:'Products'
        })
        .state('content.specialProducts',{
            url: '/specialProducts',
            templateUrl: 'partials/admin/content/specialProducts/viewAll.html',
            controller:'ProductPage'
        })
        .state('content.articles',{
            url: '/articles',
            templateUrl: 'partials/admin/content/articles/root.html',
            controller:'Articles'
        })
        .state('content.evenimente',{
            url: '/evenimente',
            templateUrl: 'partials/admin/content/events/root.html',
            controller:'Events'
        })
        .state('content.adaugaEveniment',{
            url: '/addEvent',
            templateUrl: 'partials/admin/content/events/evenimenteAdd.ejs',
            controller:"AddEvent"
        })
        .state('content.adaugaRoom',{
            url: '/addRoom',
            templateUrl: 'partials/admin/content/events/roomAdd.ejs',
            controller:"AddRoom"
        })
        .state('content.updateRoom',{
            url: '/updateRoom/:id',
            templateUrl: 'partials/admin/content/events/roomUpdate.ejs',
            controller:"EditRoom"
        })

        .state('content.adaugaConferinta',{
            url: '/addConference',
            templateUrl: 'partials/admin/content/events/ConferenceAdd.ejs',
            controller:"AddConference"
        })
        .state('content.adaugaTalk',{
            url: '/addTalk',
            templateUrl: 'partials/admin/content/events/TalkAdd.ejs',
            controller:"AddTalk"
        })
        .state('content.adaugaSpeaker',{
            url: '/addSpeaker',
            templateUrl: 'partials/admin/content/events/SpeakerAdd.ejs',
            controller:"AddSpeaker"
        })
        .state('content.updateEveniment',{
            url: '/updateEvent/:id',
            templateUrl: 'partials/admin/content/events/evenimenteUpdate.ejs',
            controller:"EditEvent"
        })
        .state('content.updateConference',{
            url: '/updateConference/:id',
            templateUrl: 'partials/admin/content/events/conferenceUpdate.ejs',
            controller:"EditConference"
        })
        .state('content.updateTalk',{
            url: '/updateTalk/:id',
            templateUrl: 'partials/admin/content/events/talkUpdate.ejs',
            controller:"EditTalk"
        })
        .state('content.updateSpeaker',{
            url: '/updateSpeaker/:id',
            templateUrl: 'partials/admin/content/events/speakerUpdate.ejs',
            controller:"EditSpeaker"
        })
        .state('content.intro',{
            url: '/intro',
            templateUrl: 'partials/admin/content/intro.html'
        })
        .state('content.carouselMedic',{
            url: '/carouselMedic',
            templateUrl: 'partials/admin/content/carouselMedic/carouselMedic.html',
            controller: 'CarouselMedic'
        })
        .state('content.carouselPublic',{
            url: '/carouselPublic',
            templateUrl: 'partials/admin/content/carouselPublic/carouselPublic.html',
            controller: 'CarouselPublic'
        })
        .state('content.publicContent',{
            url: '/publicContent',
            templateUrl: 'partials/admin/content/publicContent/publicContent.html',
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
            templateUrl: '/partials/admin/elearning/root.html'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/admin/elearning/multimedia/root.html',
            controller: 'Multimedia'
        })
        .state('elearning.multimedia.adaugaMultimedia',{
            parent:'elearning.multimedia',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/admin/elearning/multimedia/multimediaAdd.ejs',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'fade',
                    controller:"AddMultimedia"
                })
            }]
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