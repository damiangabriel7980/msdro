controllers.controller('RootController', ['$scope', '$rootScope', 'RootService', function ($scope, $rootScope, RootService) {

    //navbar "despre" categories
    RootService.categories.query().$promise.then(function (resp) {
        $scope.navCategories = resp.success;
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
    $scope.openNavbar = function () {
        $scope.navCollapsed = false;
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.closeNavbar();
    })

}]);