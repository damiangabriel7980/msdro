var publicApp = angular.module('publicApp',
    [
        'ui.router',
        'ui.bootstrap',
        'publicControllers',
        'publicServices',
        'ngTouch',
        'angular-carousel',
        'msdTimeline',
//        'ngTinyScrollbar',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.poster',
        'angularFileUpload'
    ]);

publicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home/noutati");
    $stateProvider
        .state('home',{
            templateUrl: 'partials/public/home.html',
            controller: 'HomeController'
        })
        .state('home.noutati',{
            url: '/home/noutati',
            templateUrl: 'partials/public/home/noutati.html',
            controller: 'NoutatiController'
        })
        .state('home.cmcArticole',{
            url: '/home/cmcArticole',
            templateUrl: 'partials/public/home/cmcArticole.html',
            controller: 'CeleMaiCititeController'
        })
        .state('home.downloads',{
            url: '/home/downloads',
            templateUrl: 'partials/public/home/downloads.html',
            controller: 'HomeDownloadsController'
        })
        .state('stiri', {
            abstract: true,
            url: '/stiri',
            templateUrl: 'partials/public/stiri/root.html',
            controller: 'NewsController'
        })
        .state('stiri.all',{
            url: '/all',
            templateUrl: 'partials/public/stiri/all.html'
        })
        .state('stiri.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/stiri/detail.html',
            controller: 'ArticlesDetailController'
        })
        .state('articole', {
            abstract: true,
            url: '/articole',
            templateUrl: 'partials/public/articole/root.html',
            controller: 'ArticlesController'
        })
        .state('articole.all',{
            url: '/all',
            templateUrl: 'partials/public/articole/all.html'
        })
        .state('articole.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/articole/detail.html',
            controller: 'ArticlesDetailController'
        })
        .state('elearning', {
            abstract: true,
            url: '/elearning/:area',
            templateUrl: 'partials/public/elearning/root.html',
            controller: 'ElearningController'
        })
        .state('elearning.all',{
            url: '/all',
            templateUrl: 'partials/public/elearning/all.html'
        })
        .state('elearning.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/elearning/detail.html',
            controller: 'ElearningDetailController'
        })
        .state('downloads', {
            abstract: true,
            url: '/downloads',
            templateUrl: 'partials/public/downloads/root.html',
            controller: 'DownloadsController'
        })
        .state('downloads.all',{
            url: '/all',
            templateUrl: 'partials/public/downloads/all.html'
        })
        .state('downloads.detail',{
            url: '/detail/:id',
            templateUrl: 'partials/public/downloads/detail.html',
            controller: 'DownloadsDetailController'
        })
}]);

publicApp.run(
    [            '$rootScope', '$state', '$stateParams', '$modal', '$sce',
        function ($rootScope,   $state,   $stateParams, $modal, $sce) {

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

            //global functions
            $rootScope.htmlToPlainText = function(text) {
                return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
            };
            $rootScope.createHeader = function (text,length) {
                var textLength = text?text.length:0;
                if(textLength > length){
                    var trimmed = $rootScope.htmlToPlainText(text).substring(0,length);
                    var i = trimmed.length;
                    while(trimmed[i]!=' ' && i>0) i--;
                    trimmed = trimmed.substr(0, i);
                    if(trimmed.length > 0) trimmed = trimmed+"...";
                    return trimmed;
                }else{
                    return $rootScope.htmlToPlainText(text);
                }
            };
            $rootScope.trustAsHtml = function (data) {
                return $sce.trustAsHtml(data);
            };

            //contact modal
            $rootScope.showContactModal = function(){
                $modal.open({
                    templateUrl: 'partials/public/modals/contactModal.html',
                    size: 'lg',
                    windowClass: 'fade',
                    controller: 'ContactModalController'
                });
            };

            //auth modal
            $rootScope.showAuthModal = function(intent){
                $modal.open({
                    templateUrl: 'partials/public/auth/baseModal.html',
                    size: 'lg',
                    windowClass: 'fade',
                    controller: 'AuthModalController',
                    resolve:{
                        intent: function () {
                            return intent;
                        }
                    }
                });
            };
        }
    ]
);