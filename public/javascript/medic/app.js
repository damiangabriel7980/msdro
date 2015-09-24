var app = angular.module('app',
    [
        'oc.lazyLoad',
        'ui.router',
        'controllers',
        'services',
        'ui.bootstrap',
        'ngAnimate',
        'ngCookies',
        'angulartics',
        'angulartics.google.analytics',
        'offClick',
        'bootstrapSearch',
        'specialDropdown',
        'footerResponsive',
        'verticalContentList',
        'horizontalContentList',
        'widgetMostRead',
        'mobileContentList',
        'checklist-model'
    ]);

app.config(['$controllerProvider', '$filterProvider', function ($controllerProvider, $filterProvider) {
    app.controllerProvider = $controllerProvider;
    app.filterProvider = $filterProvider;
}]);

app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        //debug: true,
        modules: [
            {
                name: 'Home',
                files: [
                    'javascript/medic/HomeControllers/Home.js'
                ]
            },
            {
                name: 'Search',
                files: [
                    'javascript/medic/HomeControllers/Search.js'
                ]
            },
            {
                name: 'Intro',
                files: [
                    'javascript/medic/ModalControllers/PresentationModal.js'
                ]
            },
            {
                name: 'Articles',
                files: [
                    'javascript/medic/ArticlesControllers/ArticlesView.js',
                    'javascript/medic/ArticlesControllers/ArticleDetail.js'
                ]
            },
            {
                name: 'TherapeuticAreas',
                files: [
                    'javascript/medic/TherapeuticAreasControllers/TherapeuticAreas.js'
                ]
            },
            {
                name: 'Products',
                files: [
                    'javascript/medic/ProductsControllers/ProductsView.js',
                    'javascript/medic/ProductsControllers/ProductDetail.js'
                ]
            },
            {
                name: 'MultimediaView',
                files: [
                    'javascript/medic/MultimediaControllers/MultimediaView.js'
                ]
            },
            {
                name: 'MultimediaDetail',
                files: [
                    'javascript/medic/MultimediaControllers/MultimediaDetail.js'
                ]
            },
            {
                name: 'CoursesView',
                files: [
                    'javascript/medic/ELearningControllers/CoursesView.js'
                ]
            },
            {
                name: 'CoursesDetails',
                files: [
                    'javascript/medic/ELearningControllers/CourseDetails.js'
                ]
            },
            {
                name: 'CourseTestResult',
                files: [
                    'javascript/medic/ModalControllers/CourseTestResult.js'
                ]
            },
            {
                name: 'SlideView',
                files: [
                    'javascript/medic/ELearningControllers/SlideView.js'
                ]
            },
            {
                name: 'ProductPage',
                files: [
                    'javascript/medic/ProductPageControllers/ProductPage.js',
                    'javascript/medic/ProductPageControllers/ProductPageMenu.js',
                    'javascript/medic/ProductPageControllers/ProductPageDownloads.js',
                    'javascript/medic/ProductPageControllers/ProductPageGlossary.js',
                    'javascript/medic/ProductPageControllers/ProductPageSpeaker.js',
                    'javascript/medic/ProductPageControllers/ProductPageQA.js',
                    'javascript/medic/ModalControllers/immunologyQAModal.js'
                ]
            },
            {
                name: 'Profile',
                files: [
                    'javascript/medic/ProfileControllers/Profile.js'
                ]
            },
            {
                name: 'Calendar',
                files: [
                    'components/fullcalendar/dist/fullcalendar.css',
                    'components/fullcalendar/dist/fullcalendar.js',
                    'components/fullcalendar/dist/gcal.js',
                    'javascript/medic/EventsControllers/Events.js',
                    'javascript/medic/EventsControllers/EventModal.js',
                    'components/angular-ui-calendar/src/calendar.js',
                    'components/angular-utils-pagination/dirPagination.js'
                ]
            },
            {
                name: 'LiveTransmission',
                files: [
                    'javascript/medic/LiveTransmissionsControllers/swfobject.js',
                    'javascript/medic/LiveTransmissionsControllers/require.js',
                    'javascript/medic/LiveTransmissionsControllers/LiveTransmission.js'
                ]
            },
            {
                name: 'PDFModal',
                files: [
                    'javascript/medic/ModalControllers/PDFModal.js'
                ]
            },
            {
                name: 'Carousel',
                files: [
                    'components/requestAnimationFrame/app/requestAnimationFrame.js',
                    'components/es5-shim/es5-shim.min.js',
                    'components/shifty/dist/shifty.min.js',
                    'components/angular-carousel/dist/angular-carousel.min.css',
                    'components/angular-carousel/dist/angular-carousel.min.js'
                ]
            },
            {
                name: 'selectAutocomplete',
                files: [
                    'modules/angular-select-autocomplete/directive.js',
                    'modules/angular-select-autocomplete/styles.css'
                ]
            },
            {
                name: 'Accordion',
                files: [
                    'components/angular-ui-tree/dist/angular-ui-tree.min.css',
                    'components/angular-ui-tree/dist/angular-ui-tree.js'
                ]
            },
            {
                name: 'FileUpload',
                files: [
                    'components/ng-file-upload/ng-file-upload.min.js'
                ]
            },
            {
                name: 'TherapeuticSelect',
                files: [
                    'modules/therapeutic_select/therapeutic_select.css',
                    'modules/therapeutic_select/therapeutic_select.js'
                ]
            },
            {
                name: 'PDFModule',
                files: [
                    'modules/angular-pdf-custom/angular-pdf-custom.js'
                ]
            },
            {
                name: 'Videogular',
                files: [
                    'components/videogular/videogular.min.js',
                    'components/videogular-controls/vg-controls.min.js',
                    'components/videogular-overlay-play/vg-overlay-play.min.js',
                    'components/videogular-poster/vg-poster.min.js',
                    'components/videogular-buffering/vg-buffering.min.js'
                ]
            },
            {
                name: 'VideoJS',
                files: [
                    'components/video-js/dist/video-js/video-js.min.css',
                    'components/video-js/dist/video-js/video.js'
                ]
            }


        ]
    });
}]);

app.config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

var loadStateDeps = function (deps, loadInSeries) {
    return ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load(deps, {serie: loadInSeries || false});
    }]
};

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'partials/medic/home.ejs',
            controller: 'Home',
            resolve: {
                loadDeps: loadStateDeps(['Home', 'Carousel'])
            }
        })
        .state('homeSearch',{
            url: '/searchResults/:textToSearch',
            templateUrl: 'partials/medic/homeSearch.ejs',
            controller: 'Search',
            resolve: {
                loadDeps: loadStateDeps(['Search'])
            }
        })
        .state('noutati', {
            //abstract: true,
            url: '/noutati/:articleType',
            templateUrl: 'partials/medic/noutati/noutati.ejs',
            controller: 'ArticlesView',
            resolve: {
                loadDeps: loadStateDeps(['Articles'])
            }
        })
        .state('noutati.listaArticole',{
            url: '/listaArticole',
            templateUrl: 'partials/medic/noutati/listaArticole.ejs'
        })
        .state('noutati.articol',{
            url: '/articol/:articleId/:searchTerm',
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
            templateUrl: 'partials/medic/filterByTherapeuticAreas.html',
            controller: 'TherapeuticAreas',
            resolve: {
                loadDeps: loadStateDeps(['TherapeuticAreas', 'Products'])
            }
        })
        .state('biblioteca.produse.productsByArea',{
            url: '/productsByArea/:id',
            templateUrl: 'partials/medic/biblioteca/productsByArea.ejs',
            controller: 'ProductsView'
        })
        .state('biblioteca.produse.prodById',{
            url: '/produse/:id/:area',
            templateUrl: 'partials/medic/biblioteca/productDetails.ejs',
            controller: 'ProductDetail'
        })
        .state('biblioteca.articoleStiintifice',{
            url: '/articoleStiintifice/:articleType',
            templateUrl: 'partials/medic/noutati/noutati.ejs',
            controller: 'ArticlesView',
            resolve: {
                loadDeps: loadStateDeps(['Articles'])
            }
        })
        .state('biblioteca.articoleStiintifice.listaArticole',{
            url: '/listaArticole',
            templateUrl: 'partials/medic/noutati/listaArticole.ejs'
        })
        .state('biblioteca.articoleStiintifice.articol',{
            url: '/articol/:articleId/:searchTerm',
            templateUrl: 'partials/medic/noutati/articol.ejs',
            controller: 'ArticleDetail'
        })
       .state('calendar',{
            url: '/calendar/:id',
            templateUrl: 'partials/medic/calendar.ejs',
            controller: 'Events',
            resolve: {
                loadDeps: loadStateDeps(['Calendar'])
            }
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning',
            templateUrl: '/partials/medic/elearning/elearning.ejs'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/medic/filterByTherapeuticAreas.html' ,
            controller: 'TherapeuticAreas',
            resolve: {
                loadDeps: loadStateDeps(['TherapeuticAreas'])
            }
        })
        .state('elearning.multimedia.multimediaMobile',{
            url: '/multimediaMobile/:idArea/:id',
            templateUrl: 'partials/medic/elearning/multimediaDetails.ejs' ,
            resolve:{
                idMultimedia: ['$stateParams', function ($stateParams) {
                    return $stateParams.id;
                }],
                loadDeps: loadStateDeps(['MultimediaDetail', 'VideoJS'])
            },
            controller: 'MultimediaDetail'
        })
        .state('elearning.multimedia.multimediaByArea',{
            url: '/multimedia/:idArea/:idMulti',
            templateUrl: 'partials/medic/elearning/multimediaByArea.ejs',
            controller: 'MultimediaView',
            resolve: {
                loadDeps: loadStateDeps(['MultimediaView'])
            }
        })
        .state('elearning.courses',{
            url: '/cursuri',
            templateUrl: 'partials/medic/elearning/courses/courses.ejs',
            controller: 'CoursesView',
            resolve: {
                loadDeps: loadStateDeps(['CoursesView', 'Accordion'])
            }
        })
        .state('elearning.chapters',{
            url: '/:courseId/chapters',
            templateUrl: 'partials/medic/elearning/courses/courseDetails.ejs',
            controller: 'CourseDetails',
            params: {
                fromTest: {array: false},
                testScore: {array: false}
            },
            resolve: {
                loadDeps: loadStateDeps(['CoursesDetails'])
            }
        })
        .state('elearning.slide',{
            url: '/course/:courseId/subchapter/:subchapterId/slide/:slideId',
            templateUrl: 'partials/medic/elearning/courses/slideView.ejs',
            controller: 'SlideView',
            resolve: {
                loadDeps: loadStateDeps(['SlideView'])
            }
        })
        .state('elearning.transmisii',{
            url: '/transmisii',
            templateUrl: 'partials/medic/elearning/transmisii.ejs',
            controller: 'LiveTransmission',
            resolve: {
                loadDeps: loadStateDeps(['LiveTransmission'])
            }
        })
        .state('groupFeatures', {
            url: '/groupFeatures/:specialApp',
            templateUrl: 'partials/medic/groupFeatures/groupFeatures.html',
            controller: 'DisplayFeatures'
        })
        .state('groupSpecialProduct', {
            url: '/groupSpecialProduct/:product_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct.html',
            controller: 'ProductPage',
            resolve: {
                loadDeps: loadStateDeps(['ProductPage'])
            }
        })
        .state('groupSpecialProduct.menuItem', {
            url: '/menuItem/:menuId/:childId',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_Menu.html',
            controller: 'ProductPageMenu'
        })
        .state('groupSpecialProduct.speakers', {
            url: '/speakers',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_speakers.html'
        })
        .state('groupSpecialProduct.speakerDetails', {
            url: '/speakerDetails/:speaker_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_speakerDetails.html',
            controller: 'ProductPageSpeaker'
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
            templateUrl: 'partials/medic/groupFeatures/specialProduct_sitemap.html'
        })
        .state('profileMobile',{
            url: '/profileMobile',
            templateUrl: 'partials/medic/profile.html',
            controller: 'Profile',
            resolve: {
                loadDeps: loadStateDeps(['Profile', 'selectAutocomplete', 'TherapeuticSelect', 'FileUpload'])
            }
        })
        .state('groupSpecialProduct.immunologyQA',{
            url:'/immunologyQA',
            templateUrl:'partials/medic/groupFeatures/immunologyQA.html',
            controller:'ProductPageQA'
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', '$modal','$sce','PrintService','Utils', 'SpecialFeaturesService','$modalStack', '$ocLazyLoad',
        function ($rootScope,   $state,   $stateParams,   $modal,  $sce, PrintService, Utils, SpecialFeaturesService, $modalStack, $ocLazyLoad) {

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
            $rootScope.defaultUserImage = $rootScope.pathAmazonResources+ "avatar_unknown.png";

            $rootScope.defaultGroupPhoto = $rootScope.pathAmazonResources + 'customGroups/grup_logo2.png';

            $rootScope.MSDlogo = $rootScope.pathAmazonResources+"rsz_msd_be_well_green_gray.png";

            $rootScope.loaderForSlowConn = "https://s3-eu-west-1.amazonaws.com/msddev-test/resources/page-loader.gif";

            $rootScope.printPage = function(){
                PrintService.printWindow();
            };

            //state events
            $rootScope.$on('$stateChangeSuccess',
                function(){
                    window.scrollTo(0,0);
                });

            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if($modalStack)
                        $modalStack.dismissAll();
                });
            //============================================================================================= intro modal
            $rootScope.showIntroPresentation = function (groupID) {
                $modal.open({
                    templateUrl: 'partials/medic/modals/presentationModal.html',
                    keyboard: false,
                    backdrop: 'static',
                    windowClass: 'fade',
                    controller: 'PresentationModal',
                    resolve: {
                        groupID: function () {
                            return groupID;
                        },
                        loadDeps: loadStateDeps(['Intro'])
                    }
                });
            };

            //=============================================================================================== PDF modal
            var pdfResources = {
                Pharma: {
                    link: "https://s3-eu-west-1.amazonaws.com/msdapp/resources/files/raportare-reactii-adverse.pdf",
                    title: "Farmacovigilenta"
                },
                Terms: {
                    link: "https://s3-eu-west-1.amazonaws.com/msdapp/resources/files/terms+%26+conditions.pdf",
                    title: "Termeni si conditii"
                },
                MerckManual: {
                    link: "/merckManual",
                    title: "Manualul Merck"
                }
            };

            $rootScope.showPDFModal = function(resource) {
                if(Utils.isMobile(false,true)['isIOSDevice'] || Utils.isMobile(false,true)['isAndroidDevice'])
                    window.open(pdfResources[resource].link);
                else {
                    $modal.open({
                        templateUrl: 'partials/medic/modals/PDFModal.html',
                        keyboard: false,
                        size: 'lg',
                        windowClass: 'fade modal-responsive',
                        backdrop: 'static',
                        controller: 'PDFModal',
                        resolve: {
                            pdfResource: function () {
                                return pdfResources[resource];
                            },
                            loadDeps: loadStateDeps(['PDFModule', 'PDFModal'])
                        }
                    });
                }
            };

            //============================================================================= expose global functions
            $rootScope.trustAsHtml = Utils.trustAsHtml;
            $rootScope.htmlToPlainText = Utils.htmlToPlainText;
            $rootScope.convertAndTrustAsHtml = Utils.convertAndTrustAsHtml;
            $rootScope.trimText = Utils.trimText;
            $rootScope.trimWords = Utils.trimWords;
            $rootScope.createHeader = Utils.createHeader;
            $rootScope.isMobile = Utils.isMobile;
            $rootScope.loadStateDeps = loadStateDeps;


            //=========================================== load a special css file for mobile devices / tablets only
            angular.element(document).ready(function () {
                if(Utils.isMobile(false, true)["any"]){
                    var mobileCssPath = 'stylesheets/medic/mobileOnly.css';
                    $ocLazyLoad.load(mobileCssPath).then(function () {
                        var fileref = document.createElement("link");
                        fileref.setAttribute("rel", "stylesheet");
                        fileref.setAttribute("type", "text/css");
                        fileref.setAttribute("href", mobileCssPath);
                        console.log("set");
                    });
                }
            });
        }
    ]
);