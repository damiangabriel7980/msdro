/**
 * @ngdoc controller
 * @name controllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
app.controllerProvider.register('ProductsView', ['$scope', '$state', '$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', 'Success', 'SpecialFeaturesService', function($scope, $state, $rootScope,ProductService,$stateParams,$sce,$window,$timeout,Success,SpecialFeaturesService){
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
        SpecialFeaturesService.specialGroups.getSelected().then(function (specialGroupSelected) {
            ProductService.products
                .query({
                    idArea:$stateParams.id,
                    specialGroup: specialGroupSelected?specialGroupSelected._id:null,
                    firstLetter: letter
                })
                .$promise.then(function(result){
                    $scope.products = Success.getObject(result);
                    if(!letter) refreshLetters(Success.getObject(result));
                });
        });
    };
    $scope.getProducts();

    $scope.navigateProductDetails = function (product) {
        $state.go('biblioteca.produse.prodById', {id:product._id});
    }
}]);
