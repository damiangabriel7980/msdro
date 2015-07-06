controllers.controller('RootController', ['$scope', '$rootScope', 'RootService', 'Error','Success', function ($scope, $rootScope, RootService, Error, Success) {

    //navbar "despre" categories
    RootService.categories.query().$promise.then(function (resp) {
        $scope.navCategories = Success.getObject(resp);
    });

    $rootScope.getNavCategoryName = function (category_id) {
        var categories = $scope.navCategories;
        if(categories){
            for(var i=0; i<categories.length; i++){
                if(categories[i]._id === category_id) return categories[i].name;
            }
            return "";
        }
    };

    //navbar collapse
    $scope.navCollapsed = true;
    $scope.closeNavbar = function () {
        $scope.navCollapsed = true;
    };
    $scope.toggleNavbar = function () {
        $scope.navCollapsed = !$scope.navCollapsed;
    };
    $scope.openNavbar = function () {
        $scope.navCollapsed = false;
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.closeNavbar();
    })

}]);