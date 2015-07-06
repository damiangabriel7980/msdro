/**
 * @ngdoc controller
 * @name controllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
controllers.controller('ProductsView', ['$scope', '$state', '$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', 'Success', 'Error', function($scope, $state, $rootScope,ProductService,$stateParams,$sce,$window,$timeout,Success,Error){
    $scope.lmt=8;
    $scope.status = {
        isopen: false
    };
    $scope.increaseLimit=function(){
        $scope.lmt+=8;
    };

    var refreshLetters = function (products) {
        //keeping the letters in an object rather than an array will insure that they are alphabetically sorted
        var firstLetters = {};
        for(var i=0; i<products.length; i++){
            firstLetters[products[i].name.charAt(0).toUpperCase()] = true;
        }
        $scope.firstLetters = firstLetters;
    };

    $scope.getProducts = function (letter) {
        ProductService.products
            .query({
                idArea:$stateParams.id,
                specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id:null,
                firstLetter: letter
            })
            .$promise.then(function(result){
                $scope.products = Success.getObject(result);
                if(!letter) refreshLetters(Success.getObject(result));
            });
    };
    $scope.getProducts();

    $scope.navigateProductDetails = function (product) {
        $state.go('biblioteca.produse.prodById', {id:product._id});
    }
}]);
