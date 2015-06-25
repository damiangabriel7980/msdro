/**
 * @ngdoc controller
 * @name controllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
controllers.controller('ProductsView', ['$scope', '$state', '$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', function($scope, $state, $rootScope,ProductService,$stateParams,$sce,$window,$timeout){
    window.scrollTo(0,0);
    $scope.lmt=8;
    $scope.status = {
        isopen: false
    };
    $scope.increaseLimit=function(){
        $scope.lmt+=8;
    };
    $scope.firstLetters={};
    $scope.allLetters = {};

    ProductService.products.query({idArea:$stateParams.id, specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.products = result.success;
        $scope.allLetters['A-Z'] = $scope.products;
        $scope.products.forEach(function (item) {
            var firstLetter = item.name.charAt(0);
            if (!$scope.firstLetters[firstLetter]) {
                $scope.firstLetters[firstLetter] = [];
            }
            $scope.firstLetters[firstLetter].push(item);
        });

    });
    $scope.filterResults=function(key){
        if(key === 'A-Z')
            $scope.products = $scope.allLetters[key];
        else
            $scope.products = $scope.firstLetters[key];
    };
    $scope.navigateProductDetails = function (product) {
        $state.go('biblioteca.produse.prodById', {id:product._id});
    }
}]);
