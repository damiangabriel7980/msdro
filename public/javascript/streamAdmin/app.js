var streamAdminApp = angular.module('streamAdminApp',
    [
        'ui.router',
        'controllers',
        'services',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.bootstrap',
        'ngTable',
        'ui.bootstrap.datetimepicker',
        'ngFileUpload',
        'angularSelectAutocomplete',
        'therapeuticSelect'
    ]);

streamAdminApp.config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

streamAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/liveConferences");
    $stateProvider
        .state('liveConferences',{
            url: '/liveConferences',
            templateUrl: 'partials/streamAdmin/adminConference.html',
            controller: 'AdminConferenceCtrl'
        })
}]);
streamAdminApp.run(
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
            $rootScope.pathAmazonDev = DEFAULT_AMAZON_PREFIX+$rootScope.amazonBucket+"/";

            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";
            $rootScope.defaultFileImage = $rootScope.pathAmazonResources+"file.png";
        }
    ]
);