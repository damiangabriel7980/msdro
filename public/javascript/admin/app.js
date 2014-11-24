/**
 * Created by miricaandrei23 on 24.11.2014.
 */
var cloudAdminApp = angular.module('cloudAdminApp',
    [
        'ui.router',
        'ui.select',
        'ui.bootstrap'
    ]);

cloudAdminApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'partials/admin/home.ejs'
        })
        .state('ManageUsers.manage',{
            url: '/manageUsers',
            templateUrl: 'partials/admin/users/manageAccounts.ejs'
        })
}])

cloudAdminApp.run(
    [            '$rootScope', '$state', '$stateParams', '$modal',
        function ($rootScope,   $state,   $stateParams, $modal) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //amazon service paths
            //pathAmazonDev needs to be changed in production
            $rootScope.pathAmazonDev = "https://s3-eu-west-1.amazonaws.com/msddev-test/";
            $rootScope.pathAmazonResources = $rootScope.pathAmazonDev+"resources/";

            $rootScope.merckManualImage = $rootScope.pathAmazonResources+"merckManual.jpg";

            $rootScope.defaultArticleImage = $rootScope.pathAmazonResources+"article.jpg";
            $rootScope.defaultVideoImage = $rootScope.pathAmazonResources+"video.png";
            $rootScope.defaultSlideImage = $rootScope.pathAmazonResources+"slide.png";

            //profile modal
            $rootScope.showProfile = function(){
                $modal.open({
                    templateUrl: 'partials/medic/profile.html',
                    size: 'lg',
                    windowClass: 'fade',
                    controller: 'ProfileController'
                });
            }
        }
    ]
);