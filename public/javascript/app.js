var cloudAdminApp = angular.module('cloudAdminApp',
    [
        'ngRoute',

        'cloudAdminControllers',
        'cloudAdminServices'
    ])

cloudAdminApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/children', {
            templateUrl: 'partials/children.html',
            controller: 'AddChildren'
        })

}]);