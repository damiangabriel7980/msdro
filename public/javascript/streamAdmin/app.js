var cloudStreamAdminApp = angular.module('cloudStreamAdminApp',
    [
        'ui.router',
        'cloudStreamAdminControllers',
        'cloudStreamAdminServices'
    ]);

cloudStreamAdminApp.config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

cloudStreamAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/transmisiiLive");
    $stateProvider
        .state('transmisiiLive',{
            url: '/transmisiiLive',
            templateUrl: 'partials/streamAdmin/elearning/transmisiiLive.html',
            controller: 'LiveTransmission'
        })
}]);
cloudStreamAdminApp.run(
    [            '$rootScope', '$state', '$stateParams', '$modal',
        function ($rootScope,   $state,   $stateParams, $modal) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //amazon service paths
            $rootScope.amazonBucket = DEFAULT_AMAZON_BUCKET;
            $rootScope.pathAmazonDev = "https://s3-eu-west-1.amazonaws.com/"+$rootScope.amazonBucket+"/";

            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";
            $rootScope.defaultFileImage = $rootScope.pathAmazonResources+"file.png";
        }
    ]
);