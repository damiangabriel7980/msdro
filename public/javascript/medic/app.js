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
        'ui.bootstrap'
    ]);

cloudAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'partials/medic/home.ejs',
            controller: 'HomeController'
        })
        .state('homeSearch',{
            url: '/searchResults',
            templateUrl: 'partials/medic/homeSearch.ejs',
            controller: 'HomeSearchController'
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
            url: '/calendar/:id',
            templateUrl: 'partials/medic/calendar.ejs',
            controller: 'eventsController'
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
            url: '/multimedia/:idArea:idMulti',
            templateUrl: 'partials/medic/elearning/multimediaByArea.ejs',
            controller: 'multimediaController'
        })
        .state('elearning.transmisii',{
            url: '/transmisii',
            templateUrl: 'partials/medic/elearning/transmisii.ejs',
            controller: 'liveTransmissionCtrl'
        })
        .state('elearning.teste',{
            url: '/teste',
            templateUrl: 'partials/medic/elearning/teste.ejs',
            controller: 'testeController'
        })
        .state('elearning.multimediaBeforeQuiz',{
            parent:'elearning.teste',
            url: '/:id',
            onEnter: ['$modal', '$state','$stateParams', function($modal, $state,$stateParams) {
                console.log('Open modal');
                $modal.open({
                    templateUrl: 'partials/medic/elearning/MultimediaBeforeQuiz.ejs',
                    windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html',
                    backdrop: 'static',
                    size: 'lg',
                    keyboard: false,
                    mouse:false,
                    windowClass: 'fade',
                    controller: 'MultimediaBeforeQuizController'
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
                    controller: 'testeQuestionsController'
                })
            }]
        })
        .state('groupFeatures', {
            url: '/groupFeatures/:feature',
            templateUrl: 'partials/medic/groupFeatures/groupFeatures.html',
            controller: 'DisplayFeaturesController'
        })
        .state('groupSpecialProduct', {
            url: '/groupSpecialProduct',
            templateUrl: 'partials/medic/groupFeatures/specialProduct.html',
            controller: 'specialProductCtrl'
        })
        .state('groupSpecialProduct.productInfo', {
        url: '/groupSpecialProduct/:product_id/productInfo',
        templateUrl: 'partials/medic/groupFeatures/specialProductInfo.html',
        controller: 'specialProductInfoCtrl'
        })
        .state('groupSpecialProduct.description', {
            url: '/selectedMenuItem/:id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_Description.html',
            controller: 'specialProductDescriptionCtrl'
        })
        .state('groupSpecialProduct.files', {
            url: '/selectedMenuFiles/:product_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_files.html',
            controller: 'specialProductFilesCtrl'
        })
        .state('groupSpecialProduct.prescription', {
            url: '/selectedMenuPrescription/:product_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_prescription.html',
            controller: 'specialProductPrescriptionCtrl'
        })
        .state('groupSpecialProduct.glossary', {
            url: '/selectedGlossary/:product_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_glossary.html',
            controller: 'specialProductGlossaryCtrl'
        })
        .state('groupSpecialProduct.sitemap', {
            url: '/sitemap/:product_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_sitemap.html',
            controller: 'specialProductMapCtrl'
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
            $rootScope.pathGlycemizer = $rootScope.pathAmazonDev + "glycemizer/Glycemizer.exe";
            $rootScope.textToSearch="";


            $rootScope.merckManualImage = $rootScope.pathAmazonResources+"merck_image_new.png";

            $rootScope.defaultArticleImage = $rootScope.pathAmazonResources+"article.jpg";
            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";
            $rootScope.MSDlogo = $rootScope.pathAmazonResources+"rsz_msd_be_well_green_gray.jpg";
            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                $rootScope.previousState = from.name;
                $rootScope.currentState = to.name;
            });
            $rootScope.bottom= {showFooter:true};
            $rootScope.searchText=function(data){
                $rootScope.textToSearch=data;
                if($rootScope.textToSearch==="")
                    return;
                else
                    $state.go('homeSearch',{},{reload: true});
            };
            $rootScope.showInput=false;
                $rootScope.animateInput=function(){
                        angular.element('.popSearch').toggleClass('newWidthPopSearch');
                    angular.element('.input-group-addon').toggleClass('btnSearchBefore');
            };
            angular.element(document).click(function (event) {
                var clickover = angular.element(event.target);
                var $navbar = angular.element(".navbar-collapse");
                var _opened = $navbar.hasClass("in");
                if (_opened === true && !clickover.hasClass("navbar-toggle")) {
                    //$navbar.collapse('hide');
                    //$navbar.height(0);
                    angular.element("button.navbar-toggle").click();
                }
            });
            //profile modal
            $rootScope.showProfile = function(){
                //var $body = $(document.body);
                //var oldWidth = $body.innerWidth();
                //var navbarOld= angular.element('.navbar').width();
                //var footerOld=angular.element('#footer').width();
                //$body.css("overflow-y", "hidden");
                //$body.width(oldWidth);
                //angular.element('.navbar').width(navbarOld);
                //angular.element('#footer').width(footerOld);
                $modal.open({
                    templateUrl: 'partials/medic/profile.html',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'fade',
                    controller: 'ProfileController'
                });
            };
        }
    ]
);