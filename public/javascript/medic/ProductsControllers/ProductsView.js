/**
 * @ngdoc controller
 * @name controllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
app.controllerProvider.register('ProductsView', ['$scope', '$state', '$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', 'Success', 'SpecialFeaturesService', 'FirstLetterService', function($scope, $state, $rootScope,ProductService,$stateParams,$sce,$window,$timeout,Success,SpecialFeaturesService, FirstLetterService){
    $scope.lmt=8;
    $scope.status = {
        isopen: false
    };
    $scope.increaseLimit=function(){
        $scope.lmt+=8;
    };

    $scope.getProducts = function (letter) {
        SpecialFeaturesService.specialGroups.getSelected().then(function (specialGroupSelected) {
            ProductService.products
                .query({
                    idPathology:$stateParams.id,
                    specialGroup: specialGroupSelected?specialGroupSelected._id:null,
                    firstLetter: letter
                })
                .$promise.then(function(result){
                    $scope.products = Success.getObject(result);
                    if(!letter)
                        $scope.firstLetters = FirstLetterService.firstLetters(Success.getObject(result), 'name');
                });
        });
    };
    $scope.getProducts();

    $scope.navigateProductDetails = function (product) {
        $state.go('biblioteca.produse.prodById', {id:product._id, area: $stateParams.id || 0});
    }
}]);
