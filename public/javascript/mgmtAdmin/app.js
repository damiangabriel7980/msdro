var app = angular.module('app',
    [
        'ui.router',
        'controllers',
        'services',
        'ngTable',
        'ngFileUpload',
        'ui.tinymce',
        'angularSelectAutocomplete',
        'ja.qr',
        'ui.bootstrap.datetimepicker',
        'myMultipleSelect',
        'therapeuticSelect',
        's3UploadManager',
        'enhancedS3UploadManager',
        'adminEmailsList',
        'adminWidgetStats',
        'ui.ace',
        'ngCsv',
        'ngAnimate',
        'vAccordion',
        'ui.tree',
        'ui.select',
        'ngSanitize',
        'actionButtons',
        'bulkOperations',
        'singleUploadManager',
        'angularBootstrapTabs'
    ]);

app.config(['$locationProvider', function($location) {
    $location.hashPrefix('!');
}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/users/manageAccounts");
    $stateProvider
        .state('users', {
            abstract: true,
            url: '/users',
            templateUrl: 'partials/mgmtAdmin/users/root.html'
        })
        .state('users.manageAccounts',{
            url: '/manageAccounts',
            templateUrl: 'partials/mgmtAdmin/users/manageAccounts.html',
            controller: 'ManageAccounts'
        })
}]);

app.run(
    [            '$rootScope', '$state', '$stateParams', 'Utils',
        function ($rootScope,   $state,   $stateParams,   Utils) {

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

            $rootScope.trustAsHtml = Utils.trustAsHtml;
        }
    ]
);
