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
        'footerResponsive',
        'verticalContentList',
        'horizontalContentList',
        'widgetMostRead',
        'mobileContentList',
        'checklist-model',
        'bootstrapSubnav'
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
                name: 'Pathology',
                files: [
                    'javascript/medic/PathologiesControllers/Pathology.js'
                ]
            },
            {
                name: 'Brochure',
                files: [
                    'javascript/medic/BrochureControllers/brochure.js'
                ]
            },
            {
                name: 'PathologiesFilter',
                files: [
                    'javascript/medic/PathologiesControllers/Pathologies.js'
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
                    'javascript/medic/ELearningControllers/CoursesView.js',
                    'components/angular-svg-round-progressbar/build/roundProgress.js'
                ]
            },
            {
                name: 'CoursesDetails',
                files: [
                    'javascript/medic/ELearningControllers/CourseDetails.js',
                    'components/angular-svg-round-progressbar/build/roundProgress.js'
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
                name: 'ProductPageList',
                files: [
                    'javascript/medic/ProductPageControllers/ProductPageList.js'
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
                name: 'vAccordion',
                files: [
                    'components/v-accordion/dist/v-accordion.min.css',
                    'components/v-accordion/dist/v-accordion.min.js'
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

app.factory('errorRecover', ['$q', '$injector', function($q, $injector) {
    var errorRecover = {
        responseError: function(response) {
            var StateService = $injector.get('$state');
            if (response.status == 404){
                StateService.go('notFound');
            } else if(response.status == 403) {
                StateService.go('forbidden');
            } else {
                StateService.go('serverError');
            }
            return $q.reject(response);
        }
    };
    return errorRecover;
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('errorRecover');
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $urlRouterProvider
        .when(/articoleStiintifice/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            if(parsedURL.length < 5)
                $state.go('biblioteca.articoleStiintifice.listaArticole', {articleType: 3}, {location: 'replace'});
            else
                $state.go('biblioteca.articoleStiintifice.articol', {articleType: parsedURL[2], articleId: parsedURL[4]}, {location: 'replace'});
        }])
        .when(/noutati/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            if(parsedURL[1] == 3)
                $state.go('biblioteca.articoleStiintifice.articol', {articleType: parsedURL[1], articleId: parsedURL[3]}, {location: 'replace'});
            else
                $state.go('noutati.articol', {articleType: parsedURL[1], articleId: parsedURL[3], fromHome: 1}, {location: 'replace'})
        }])
        .when(/produse/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            if(parsedURL[2] === 'productsByArea')
                $state.go('biblioteca.produse.productsByArea', {id: parsedURL[3]});
            else
                $state.go('biblioteca.produse.prodById', {id: parsedURL[3], area: parsedURL[4]});
        }])
        .when(/calendar/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            $state.go('calendar.events.event', {idArea: parsedURL[3]});
        }])
        .when(/conferinte/, ['$state','$match', function ($state, $match) {
            $state.go('conferinte');
        }])
        .when(/multimedia/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            if(parsedURL.length < 5)
                $state.go('elearning.multimedia.multimediaByArea',{'idArea': parsedURL[3]});
            else
                $state.go('elearning.multimedia.multimediaByArea',{'idArea': parsedURL[3], idMulti: parsedURL[4]});
        }])
        .when(/aplicatii/, ['$state','$match', function ($state, $match) {
            var parsedURL = $match.input.split('/').filter(Boolean);
            $state.go('groupFeatures', {specialApp : parsedURL[1]});
        }]);
    $stateProvider
        .state('notFound',{
            url: '/404',
            templateUrl: 'partials/shared/404.html'
        })
        .state('forbidden',{
            url: '/403',
            templateUrl: 'partials/shared/403.html'
        })
        .state('serverError',{
            url: '/500',
            templateUrl: 'partials/shared/500.html'
        })
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
            url: '/resurse',
            templateUrl: '/partials/medic/biblioteca/biblioteca.ejs'
        })
        .state('biblioteca.produse',{
            url: '/produse',
            templateUrl: 'partials/medic/filterByPathology.html',
            controller: 'PathologiesController',
            params: {
                navigateToState: 'products'
            },
            resolve: {
                loadDeps: loadStateDeps(['PathologiesFilter', 'Products'])
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
            url: '/despreMSD/:articleType',
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
        .state('calendar', {
            abstract: true,
            url: '/evenimente',
            templateUrl: '/partials/medic/calendarTemplate.ejs'
        })
       .state('calendar.events',{
           url: '/calendar',
           templateUrl: 'partials/medic/filterByPathology.html',
           controller: 'PathologiesController',
           params: {
               navigateToState: 'events'
           },
           resolve: {
               loadDeps: loadStateDeps(['PathologiesFilter'])
           }
        })
        .state('calendar.events.event',{
            url: '/eveniment/:idArea/:id',
            templateUrl: 'partials/medic/calendar.ejs',
            controller: 'Events',
            resolve: {
                loadDeps: loadStateDeps(['Calendar'])
            }
        })
        .state('elearning', {
            abstract: true,
            url: '/resurse',
            templateUrl: '/partials/medic/elearning/elearning.ejs'
        })
        .state('elearning.multimedia',{
            url: '/multimedia',
            templateUrl: 'partials/medic/filterByPathology.html' ,
            controller: 'PathologiesController',
            params: {
                navigateToState: 'multimedia'
            },
            resolve: {
                loadDeps: loadStateDeps(['PathologiesFilter'])
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
            url: '/resurse',
            templateUrl: 'partials/medic/elearning/courses/courses.ejs',
            controller: 'CoursesView',
            resolve: {
                loadDeps: loadStateDeps(['CoursesView'])
            }
        })
        .state('elearning.chapters',{
            url: '/:courseId/chapters',
            templateUrl: 'partials/medic/elearning/courses/courseDetails.ejs',
            controller: 'CourseDetails',
            params: {
                fromTest: {array: false},
                testScore: {array: false},
                minimum: {array: false},
                maximum: {array: false}
            },
            resolve: {
                loadDeps: loadStateDeps(['CoursesDetails', 'vAccordion'])
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
        .state('conferinte',{
            url: '/evenimente/conferinte',
            templateUrl: 'partials/medic/elearning/transmisii.ejs',
            controller: 'LiveTransmission',
            resolve: {
                loadDeps: loadStateDeps(['LiveTransmission'])
            }
        })
        .state('groupFeatures', {
            url: '/dovezi/:specialApp',
            templateUrl: 'partials/medic/groupFeatures/groupFeatures.html',
            controller: 'DisplayFeatures'
        })
        .state('pathologies', {
            url: '/pathologies/:pathology_id',
            templateUrl: 'partials/medic/groupFeatures/pathologies.html',
            controller: 'PathologyController',
            resolve: {
                loadDeps: loadStateDeps(['Pathology'])
            }
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
            params: {
                isResource: false
            },
            templateUrl: 'partials/medic/groupFeatures/specialProduct_Menu.html',
            controller: 'ProductPageMenu'
        })
        .state('pathologyResources', {
            url: '/pathologyResources/:product_id',
            templateUrl: 'partials/medic/groupFeatures/specialProduct.html',
            controller: 'ProductPage',
            resolve: {
                loadDeps: loadStateDeps(['ProductPage'])
            }
        })
        .state('pathologyResources.menuItem', {
            url: '/menuItem/:menuId/:childId',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_Menu.html',
            controller: 'ProductPageMenu'
        })
        .state('pathologyResources.glossary', {
            url: '/selectedGlossary',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_glossary.html',
            controller: 'ProductPageGlossary'
        })
        .state('productList', {
            abstract: true,
            url: '/pathologyProducts',
            templateUrl: '/partials/medic/groupFeatures/specialProdListTemplate.ejs'
        })
        .state('productList.all',{
            url: '/list',
            templateUrl: 'partials/medic/filterByPathology.html',
            controller: 'PathologiesController',
            params: {
                navigateToState: 'productList'
            },
            resolve: {
                loadDeps: loadStateDeps(['PathologiesFilter'])
            }
        })
        .state('productList.all.groupedByPathology', {
            url: '/pathology/:idArea',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_List.html',
            controller: 'ProductPageList',
            resolve: {
                loadDeps: loadStateDeps(['ProductPageList'])
            }
        })
        .state('pathologyResources.speakers', {
            url: '/speakers',
            templateUrl: 'partials/medic/groupFeatures/specialProduct_speakers.html'
        })
        .state('pathologyResources.speakerDetails', {
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
            params: {
                isResource: false
            },
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
        .state('pathologyResources.immunologyQA',{
            url:'/immunologyQA',
            templateUrl:'partials/medic/groupFeatures/immunologyQA.html',
            controller:'ProductPageQA'
        })
        .state('about', {
            url: '/about',
            templateUrl: '/partials/medic/brochure.html',
            controller:'brochureSections',
            resolve: {
                loadDeps: loadStateDeps(['Brochure'])
            }
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', '$modal','$sce','PrintService','Utils', 'SpecialFeaturesService','$modalStack', '$ocLazyLoad', '$window', '$timeout', '$location', '$anchorScroll',
        function ($rootScope,   $state,   $stateParams,   $modal,  $sce, PrintService, Utils, SpecialFeaturesService, $modalStack, $ocLazyLoad, $window, $timeout, $location, $anchorScroll) {

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
            $rootScope.defaultProofImage = $rootScope.pathAmazonResources+ "proofs.png";

            $rootScope.defaultUserImage = $rootScope.pathAmazonResources+ "avatar_unknown.png";
            $rootScope.brochureHeader = $rootScope.pathAmazonResources+ "brochure_header.png";

            $rootScope.defaultGroupPhoto = $rootScope.pathAmazonResources + 'customGroups/grup_logo2.png';

            $rootScope.MSDlogo = $rootScope.pathAmazonResources+"rsz_msd_be_well_green_gray.png";
            $rootScope.brochureLogo = $rootScope.pathAmazonResources + 'brochure_thumbnail.png';

            $rootScope.loaderForSlowConn = "https://s3-eu-west-1.amazonaws.com/msddev-test/resources/page-loader.gif";

            $rootScope.printPage = function(){
                PrintService.printWindow();
            };

            var scrollPosCache = {};

            $rootScope.$on('$stateChangeSuccess', function(){
                // if hash is specified explicitly, it trumps previously stored scroll position
                if ($location.hash()) {
                    $anchorScroll();

                    // else get previous scroll position; if none, scroll to the top of the page
                } else {
                    var prevScrollPos = scrollPosCache[$state.current.templateUrl] || [0, 0];
                    $timeout(function () {
                        $window.scrollTo(prevScrollPos[0], prevScrollPos[1]);
                    }, 0);
                }
            });
            
            //state events
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if($modalStack)
                        $modalStack.dismissAll();

                    // store scroll position for the current view
                    if($state.$current)
                    {
                      scrollPosCache[$state.current.templateUrl] = [$window.pageXOffset, $window.pageYOffset];
                    }
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