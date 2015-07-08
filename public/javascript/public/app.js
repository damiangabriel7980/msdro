//var app = angular.module('app',
//    [
//        'ui.select',
//        'com.2fdevs.videogular',
//        'com.2fdevs.videogular.plugins.controls',
//        'com.2fdevs.videogular.plugins.overlayplay',
//        'com.2fdevs.videogular.plugins.poster',
//        'angularFileUpload',
//    ]);

var app = angular.module('app', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'controllers',
    'services',
    'ngSanitize',
    'offClick',
    'mobileContentList',
    'footerResponsive',
    'horizontalContentList',
    'widgetMostRead'
]);

app.config(['$controllerProvider', function ($controllerProvider) {
    app.controllerProvider = $controllerProvider;
}]);

app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true,
        modules: [
            {
                name: 'Home',
                files: [
                    'javascript/public/HomeControllers/HomeView.js',
                    'javascript/public/HomeControllers/HomeMobileNews.js',
                    'javascript/public/HomeControllers/HomeMostRead.js',
                    'javascript/public/HomeControllers/HomeNews.js',
                    'javascript/public/HomeControllers/HomeDownloads.js'
                ]
            },
            {
                name: 'fancyCarousel',
                files: [
                    'components/requestAnimationFrame/app/requestAnimationFrame.js',
                    'components/es5-shim/es5-shim.min.js',
                    'components/shifty/dist/shifty.min.js',
                    'components/angular-carousel/dist/angular-carousel.min.css',
                    'components/angular-carousel/dist/angular-carousel.min.js',
                    'modules/fancy-carousel/styles.css',
                    'modules/fancy-carousel/directive.js'
                ]
            },
            {
                name: 'calendarTimeline',
                files: [
                    'modules/calendar-timeline/timelineStyles.css',
                    'modules/calendar-timeline/timelineDirective.js'
                ]

            },
            {
                name: 'News',
                files: [
                    'javascript/public/NewsControllers/NewsView.js',
                    'javascript/public/ArticlesControllers/ArticlesDetail.js'
                ]
            },
            {
                name: 'Articles',
                files: [
                    'javascript/public/ArticlesControllers/ArticlesView.js',
                    'javascript/public/ArticlesControllers/ArticlesDetail.js'
                ]
            },
            {
                name: 'Elearning',
                files: [
                    'javascript/public/ElearningControllers/ElearningView.js',
                    'javascript/public/ElearningControllers/ElearningDetail.js'
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
            }
        ]
    });
}]);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix(HASH_PREFIX);
}]);

var loadStateDeps = function (deps) {
    return ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load(deps);
    }]
};

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
        //console.log($location.url());
        if(REQUESTED_PRO) {
            REDIRECT_AFTER_LOGIN = $location.url();
            REQUESTED_PRO = 0;
            $location.path("/home/noutati");
        }
    });
    $urlRouterProvider.otherwise(function ($injector, $location) {
        if(!REQUESTED_PRO) {
            $location.path("/home/noutati");
        }
    });
    $stateProvider
        .state('home',{
            templateUrl: 'partials/public/home.html',
            controller: 'HomeView',
            resolve: {
                loadDeps: loadStateDeps(['Home', 'calendarTimeline', 'fancyCarousel'])
            }
        })
        .state('home.noutati',{
            url: '/home/noutati',
            views: {
                mobile: {
                    templateUrl: 'partials/public/home/mobileNews.html',
                    controller: 'HomeMobileNews'
                },
                desktop: {
                    templateUrl: 'partials/public/home/noutati.html',
                    controller: 'HomeNews'
                }
            }
        })
        .state('home.cmcArticole',{
            url: '/home/cmcArticole',
            views: {
                desktop: {
                    templateUrl: 'partials/public/home/cmcArticole.html',
                    controller: 'HomeMostRead'
                }
            }
        })
        .state('home.downloads',{
            url: '/home/downloads',
            views: {
                desktop: {
                    templateUrl: 'partials/public/home/downloads.html',
                    controller: 'HomeDownloads'
                }
            }
        })
        .state('stiri', {
            abstract: true,
            url: '/stiri',
            templateUrl: 'partials/public/stiri/root.html',
            controller: 'NewsView',
            resolve: {
                loadDeps: loadStateDeps(['News'])
            }
        })
        .state('stiri.all',{
            url: '/all',
            templateUrl: 'partials/public/stiri/all.html'
        })
        .state('stiri.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/stiri/detail.html',
            controller: 'ArticlesDetail'
        })
        .state('articole', {
            abstract: true,
            url: '/articole/:category',
            templateUrl: 'partials/public/articole/root.html',
            controller: 'ArticlesView',
            resolve: {
                loadDeps: loadStateDeps(['Articles'])
            }
        })
        .state('articole.all',{
            url: '/all',
            templateUrl: 'partials/public/articole/all.html'
        })
        .state('articole.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/articole/detail.html',
            controller: 'ArticlesDetail'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning/:area',
            templateUrl: 'partials/public/elearning/root.html',
            controller: 'ElearningView',
            resolve: {
                loadDeps: loadStateDeps(['Elearning'])
            }
        })
        .state('elearning.all',{
            url: '/all',
            templateUrl: 'partials/public/elearning/all.html'
        })
        .state('elearning.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/elearning/detail.html',
            controller: 'ElearningDetail',
            resolve: {
                loadDeps: loadStateDeps(['Videogular'])
            }
        })
        .state('downloads', {
            abstract: true,
            url: '/downloads',
            templateUrl: 'partials/public/downloads/root.html',
            controller: 'DownloadsView'
        })
        .state('downloads.all',{
            url: '/all',
            templateUrl: 'partials/public/downloads/all.html'
        })
        .state('downloads.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/downloads/detail.html',
            controller: 'DownloadsDetail'
        })
        .state('publicSearch',{
            url: '/publicSearchResults',
            templateUrl: 'partials/public/publicSearch.html',
            controller: 'Search'
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', '$modal', '$sce', 'Utils', '$location', 'PublicService',
        function ($rootScope,   $state,   $stateParams,   $modal,   $sce,   Utils,   $location,   PublicService) {

            $rootScope.accessRoute = ACCESS_ROUTE;

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.textToSearch="";

            //amazon service paths
            $rootScope.amazonBucket = DEFAULT_AMAZON_BUCKET;
            $rootScope.pathAmazonDev = DEFAULT_AMAZON_PREFIX+$rootScope.amazonBucket+"/";
            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.merckManualImage = $rootScope.pathAmazonResources+"merckManual.jpg";

            $rootScope.defaultArticleImage = $rootScope.pathAmazonResources+"article.jpg";
            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";
            $rootScope.searchText=function(data){
                $rootScope.textToSearch=data;
                if($rootScope.textToSearch==="")
                    return;
                else
                    $state.go('publicSearch',{},{reload: true});
            };

            //global functions
            $rootScope.htmlToPlainText = Utils.htmlToPlainText;
            $rootScope.createHeader = Utils.createHeader;
            $rootScope.trustAsHtml = Utils.trustAsHtml;
            $rootScope.isMobile = Utils.isMobile;
            $rootScope.navigateTo = function (content) {
                $state.go(PublicService.getSref(content), {id: content._id});
            };
            $rootScope.getContentNamedType = PublicService.getContentNamedType;

            //contact modal
            $rootScope.showContactModal = function(){
                $modal.open({
                    templateUrl: 'partials/public/modals/contactModal.html',
                    size: 'lg',
                    windowClass: 'fade'
                });
            };

            //auth modal
            $rootScope.showAuthModal = function(intent){
                $modal.open({
                    templateUrl: 'partials/public/auth/baseModal.html',
                    size: 'lg',
                    backdrop: 'static',
                    windowClass: 'fade',
                    controller: 'AuthModal',
                    resolve:{
                        intent: function () {
                            return intent;
                        }
                    }
                })
                    .result.finally(function () {
                        //console.log("modal closed");
                        REDIRECT_AFTER_LOGIN = null;
                    });
            };

            //state events
            $rootScope.$on('$stateChangeSuccess',
                function(){
                    window.scrollTo(0,0);
                });

//            $rootScope.$on('$locationChangeStart', function (event) {
//                console.log("change");
//                console.log($location.host());
//                console.log($location.url());
//            })
        }
    ]
);