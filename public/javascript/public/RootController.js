controllers.controller('RootController', ['$scope', 'RootService', function ($scope, RootService) {

    RootService.categories.query().$promise.then(function (resp) {
        console.log(resp.success);
        $scope.categories = resp.success;
    });

    //navbar collapse
    $scope.navCollapsed = true;
    $scope.closeNavbar = function () {
        console.log("here");
        $scope.navCollapsed = true;
    }

}]);