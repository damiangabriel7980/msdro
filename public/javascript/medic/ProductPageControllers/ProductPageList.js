/**
 * Created by andreimirica on 09.05.2016.
 */
app.controllerProvider.register('ProductPageList', ['$scope', '$stateParams', 'specialProductService', 'Success', 'Error', 'FirstLetterService', 'concatService', '$state', function($scope, $stateParams, specialProductService, Success, Error, FirstLetterService, concatService, $state){

    $scope.getProducts = function () {
        specialProductService.SpecialProduct.query({
            idPathology: $stateParams.idArea
        }).$promise.then(function(resp){
            $scope.pathologiesAndProducts = Success.getObject(resp);
        });

    };

    $scope.getProducts();

    $scope.goToSpecialProduct = function (product) {
        $state.go('groupSpecialProduct.menuItem', {product_id: product._id}, {inherit: false,reload: true});
    }
}]);