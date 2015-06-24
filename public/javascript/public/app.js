var app = angular.module('app',
    [
        'ui.router',
        'ui.bootstrap',
        'controllers',
        'services',
        'ngTouch',
        'angular-carousel',
        'calendarTimeline',
        'ngSanitize',
        'ui.select',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.poster',
        'angularFileUpload',
        'mobileContentList',
        'offClick',
        'fancyCarousel',
        'footerResponsive',
        'horizontalContentList'
    ]);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix(HASH_PREFIX);
}]);

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
            controller: 'HomeView'
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
            templateUrl: 'partials/public/home/cmcArticole.html',
            controller: 'HomeMostRead'
        })
        .state('home.downloads',{
            url: '/home/downloads',
            templateUrl: 'partials/public/home/downloads.html',
            controller: 'HomeDownloads'
        })
        .state('stiri', {
            abstract: true,
            url: '/stiri',
            templateUrl: 'partials/public/stiri/root.html',
            controller: 'NewsView'
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
            controller: 'ArticlesView'
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
            controller: 'ElearningView'
        })
        .state('elearning.all',{
            url: '/all',
            templateUrl: 'partials/public/elearning/all.html'
        })
        .state('elearning.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/elearning/detail.html',
            controller: 'ElearningDetail'
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
    [            '$rootScope', '$state', '$stateParams', '$modal', '$sce', 'Utils', '$location',
        function ($rootScope,   $state,   $stateParams,   $modal,   $sce,   Utils,   $location) {

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

//            $rootScope.$on('$locationChangeStart', function (event) {
//                console.log("change");
//                console.log($location.host());
//                console.log($location.url());
//            })
        }
    ]
);