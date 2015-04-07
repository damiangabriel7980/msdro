controllers.controller('RootController', ['$scope', 'RootService', function ($scope, RootService) {

    RootService.categories.query().$promise.then(function (resp) {
        console.log(resp.success);
        $scope.categories = resp.success;
    });

}]);