var app = angular.module('app',
    [
        'ui.router',
        'controllers',
        'services',
        'ui.calendar',
        'ui.select',
        'pdf',
        'timer',
        'mySlider',
        'angular-growl',
        'angular-carousel',
        'angularFileUpload',
        'ui.bootstrap',
        'ngCookies',
        'therapeuticSelect',
        'angulartics',
        'angulartics.google.analytics'
    ]);

app.config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'partials/medic/home.ejs',
            controller: 'Home'
        })
        .state('homeSearch',{
            url: '/searchResults/:textToSearch',
            templateUrl: 'partials/medic/homeSearch.ejs',
            controller: 'Search'
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
                    controller: 'Contact'
                })
            }]

        })
        .state('noutati', {
            //abstract: true,
            url: '/noutati/:articleType',
            templateUrl: 'partials/medic/noutati/noutati.ejs',
            controller: 'ArticlesView'
        })
        .state('noutati.listaArticole',{
            url: '/listaArticole',
            templateUrl: 'partials/medic/noutati/listaArticole.ejs'
        })
        .state('noutati.articol',{
            url: '/articol/:articleId',
            templateUrl: 'partials/medic/noutati/articol.ejs',
            controller: 'ArticleDetail'
        })
        .state('biblioteca', {
            abstract: true,
            url: '/biblioteca',
            templateUrl: '/partials/medic/biblioteca/biblioteca.ejs'
        })
        .state('biblioteca.produse',{
            url: '/produse',
            templateUrl: 'partials/medic/biblioteca/produse.ejs',
            controller: 'TherapeuticAreas'
        })
        .state('biblioteca.produse.productsByArea',{
            url: '/productsByArea/:id',
            templateUrl: 'partials/medic/biblioteca/productsByArea.ejs',
            controller: 'ProductsView'
        })
        .state('biblioteca.produse.prodById',{
            url: '/produse/:id',
            templateUrl: 'partials/medic/biblioteca/productDetails.ejs',
            controller: 'ProductDetail'
        })
        .state('biblioteca.articoleStiintifice',{
            url: '/articoleStiintifice/:articleType',
            templateUrl: 'partials/medic/noutati/noutati.ejs',
            controller: 'ArticlesView'
        })
        .state('biblioteca.articoleStiintifice.listaArticole',{
            url: '/listaArticole',
            templateUrl: 'partials/medic/noutati/listaArticole.ejs'
        })
        .state('biblioteca.articoleStiintifice.articol',{
            url: '/articol/:articleId',
            templateUrl: 'partials/medic/noutati/articol.ejs',
            controller: 'ArticleDetail'
        })
       .state('calendar',{
            url: '/calendar/:id',
            templateUrl: 'partials/medic/calendar.ejs',
            controller: 'Events'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/medic/elearning/elearning.ejs'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/medic/elearning/multimedia.ejs' ,
            controller: 'TherapeuticAreas'
        })
        .state('elearning.multimedia.multimediaByArea',{
            url: '/multimedia/:idArea:idMulti',
            templateUrl: 'partials/medic/elearning/multimediaByArea.ejs',
            controller: 'MultimediaView'
        })
        .state('elearning.transmisii',{
            url: '/transmisii',
            templateUrl: 'partials/medic/elearning/transmisii.ejs',
            controller: 'LiveTransmission'
        })
        .state('elearning.teste',{
            url: '/teste',
            templateUrl: 'partials/medic/elearning/teste.ejs',
            controller: 'QuizesView'
        })
        .state('elearning.multimediaBeforeQuiz',{
            parent:'elearning.teste',
            url: '/:id',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                console.log('Open modal');
                $modal.open({
                    templateUrl: 'partials/medic/elearning/MultimediaBeforeQuiz.ejs',
                    backdrop: 'static',
                    size: 'lg',
                    keyboard: false,
                    mouse:false,
                    windowClass: 'fade',
                    controller: 'MultimediaBeforeQuiz'
                })
            }]
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
                    controller: 'QuizQuestions'
                })
            }]
        })
        .state('groupFeatures', {
            url: '/groupFeatures/:specialApp',
            templateUrl: 'partials/medic/groupFeatures/groupFeatures.html',
            controller: 'DisplayFeatures'
        })
        .state('groupSpecialProduct', {
            url: '/groupSpecialProduct/:product_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct.html',
            controller: 'ProductPage'
        })
        .state('groupSpecialProduct.productInfo', {
        url: '/productInfo',
        templateUrl: 'partials/medic/groupFeatures/specialProductInfo.html',
        controller: 'ProductPageInfo'
        })
        .state('groupSpecialProduct.menuItem', {
            url: '/menuItem/:menuId/:childId',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_Menu.html',
            controller: 'ProductPageMenu'
        })
        .state('groupSpecialProduct.files', {
            url: '/selectedMenuFiles',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_files.html',
            controller: 'ProductPageDownloads'
        })
        .state('groupSpecialProduct.glossary', {
            url: '/selectedGlossary',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_glossary.html',
            controller: 'ProductPageGlossary'
        })
        .state('groupSpecialProduct.sitemap', {
            url: '/sitemap',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_sitemap.html',
            controller: 'ProductPageMap'
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', '$modal','$sce',
        function ($rootScope,   $state,   $stateParams, $modal,$sce) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            //amazon service paths
            $rootScope.amazonBucket = DEFAULT_AMAZON_BUCKET;
            $rootScope.pathAmazonDev = DEFAULT_AMAZON_PREFIX+$rootScope.amazonBucket+"/";
            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";
            $rootScope.pathGlycemizer = $rootScope.pathAmazonDev + "glycemizer/Glycemizer.exe";
            $rootScope.textToSearch="";


            $rootScope.merckManualImage = $rootScope.pathAmazonResources+"merck_image_new.png";

            $rootScope.defaultArticleImage = $rootScope.pathAmazonResources+"article.jpg";
            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";
            $rootScope.defaultProductImage = $rootScope.pathAmazonResources+ "piles-of-pills.jpg";

            $rootScope.MSDlogo = $rootScope.pathAmazonResources+"rsz_msd_be_well_green_gray.png";

            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                $rootScope.previousState = from.name;
                $rootScope.currentState = to.name;
            });
        }
    ]
);