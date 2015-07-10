controllers.controller('NavbarController', ['$scope', 'VersionService', 'Success', function ($scope, VersionService, Success) {

    VersionService.query().$promise.then(function (resp) {
        $scope.appVersion = Success.getObject(resp);
    });

}]);