controllers.controller('RootController', ['$scope', '$rootScope', 'RootService', function ($scope, $rootScope, RootService) {

    //navbar "despre" categories
    RootService.categories.query().$promise.then(function (resp) {
        $scope.navCategories = resp.success;
    });

    //navbar collapse
    $scope.navCollapsed = true;
    $scope.closeNavbar = function () {
        $scope.navCollapsed = true;
    };
    $scope.openNavbar = function () {
        $scope.navCollapsed = false;
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.closeNavbar();
    })

}]);