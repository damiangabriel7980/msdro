var cloudAdminApp = angular.module('cloudAdminApp',
    [
        'ui.router',
        'cloudAdminControllers',
        'cloudAdminServices',
        'ui.calendar',
        'ui.select',
        'pdf',
        'timer',
        'mySlider',
        'angular-growl',
        'angular-carousel',
        'ui.select',
        'angularFileUpload',
    ]);

cloudAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'partials/medic/home.ejs',
            controller: 'HomeController'
        })
        .state('contact',{
            parent:'home',
            url: '',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/medic/contact.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller: 'contactCtrl'
                })
            }]

        })
        .state('noutati', {
            //abstract: true,
            url: '/noutati/:articleType',
            templateUrl: 'partials/medic/noutati/noutati.ejs',
            controller: 'ContentController'
        })
        .state('noutati.listaArticole',{
            url: '/listaArticole',
            templateUrl: 'partials/medic/noutati/listaArticole.ejs'
        })
        .state('noutati.articol',{
            url: '/articol/:articleId',
            templateUrl: 'partials/medic/noutati/articol.ejs',
            controller: 'ContentArticleController'
        })
        .state('biblioteca', {
            abstract: true,
            url: '/biblioteca',
            templateUrl: '/partials/medic/biblioteca/biblioteca.ejs'
        })
        .state('biblioteca.produse',{
            url: '/produse',
            templateUrl: 'partials/medic/biblioteca/produse.ejs',
            controller: 'therapeuticControllerCtrl'
        })
        .state('biblioteca.produse.productsByArea',{
            url: '/productsByArea/:id',
            templateUrl: 'partials/medic/biblioteca/productsByArea.ejs',
            controller: 'productsController'
        })
        .state('biblioteca.produse.prodById',{
            url: '/produse/:id',
            templateUrl: 'partials/medic/biblioteca/productDetails.ejs',
            controller: 'productDetailsController'
        })
        .state('biblioteca.articoleStiintifice',{
            url: '/articoleStiintifice/:articleType',
            templateUrl: 'partials/medic/noutati/noutati.ejs',
            controller: 'ContentController'
        })
        .state('biblioteca.articoleStiintifice.listaArticole',{
            url: '/listaArticole',
            templateUrl: 'partials/medic/noutati/listaArticole.ejs'
        })
        .state('biblioteca.articoleStiintifice.articol',{
            url: '/articol/:articleId',
            templateUrl: 'partials/medic/noutati/articol.ejs',
            controller: 'ContentArticleController'
        })
       .state('calendar',{
            url: '/calendar',
            templateUrl: 'partials/medic/calendar.ejs',
            controller: 'eventsController'
        })
        .state('calendar.calendarDetails',{
            parent:'calendar',
            url: '/:id',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                $modal.open({
                    templateUrl: 'partials/medic/calendarDetails.ejs',
                    backdrop: true,
                    size: 'lg',
                    windowClass: 'fade',
                    controller: 'modalCtrl'
                })
            }]

        })

        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/medic/elearning/elearning.ejs'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/medic/elearning/multimedia.ejs' ,
            controller: 'therapeuticControllerCtrl'
        })
        .state('elearning.multimedia.multimediaByArea',{
            url: '/multimedia/:id',
            templateUrl: 'partials/medic/elearning/multimediaByArea.ejs',
            controller: 'multimediaController'
        })
        .state('elearning.multimedia.multimediaById',{
            parent:'elearning.multimedia.multimediaByArea',
            url: '/multimedia2/:idd',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                console.log('Open modal');
                $modal.open({
                    templateUrl: 'partials/medic/elearning/multimediaDetails.ejs',
                    windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'fade',
                    controller: 'multimediaDetailsController'
                })
            }]

        })
        .state('elearning.transmisii',{
            url: '/transmisii',
            templateUrl: 'partials/medic/elearning/transmisii.ejs'
        })
        .state('elearning.teste',{
            url: '/teste',
            templateUrl: 'partials/medic/elearning/teste.ejs',
            controller: 'testeController'
        })
        .state('elearning.teste.quizById',{
            parent:'elearning.teste',
            url: '/:id/questions/:idd',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                console.log('Open modal');
                $modal.open({
                    templateUrl: 'partials/medic/elearning/testeQuestions.ejs',
                    backdrop: 'static',
                    size: 'lg',
                    keyboard: false,
                    mouse:false,
                    windowClass: 'fade',
                    controller: 'testeQuestionsController'
                })
            }]
        })
        .state('groupFeatures', {
            url: '/groupFeatures/:feature',
            templateUrl: 'partials/medic/groupFeatures/groupFeatures.html',
            controller: 'DisplayFeaturesController'
        })
}]);

cloudAdminApp.run(
    [            '$rootScope', '$state', '$stateParams', '$modal','$sce',
        function ($rootScope,   $state,   $stateParams, $modal,$sce) {

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

            $rootScope.merckManualImage = $rootScope.pathAmazonResources+"merckManual.jpg";

            $rootScope.defaultArticleImage = $rootScope.pathAmazonResources+"article.jpg";
            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";

            //profile modal
            $rootScope.showProfile = function(){
                $modal.open({
                    templateUrl: 'partials/medic/profile.html',
                    size: 'lg',
                    windowClass: 'fade',
                    controller: 'ProfileController'
                });
            }
        }
    ]
);