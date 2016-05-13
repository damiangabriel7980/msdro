/**
 * Created by andreimirica on 09.05.2016.
 */
app.controllerProvider.register('ProductPageList', ['$scope', '$stateParams', 'specialProductService', 'Success', 'Error', 'FirstLetterService', 'concatService', '$state', function($scope, $stateParams, specialProductService, Success, Error, FirstLetterService, concatService, $state){

    $scope.getProducts = function (letter) {
        specialProductService.SpecialProduct.query({
            firstLetter: letter
        }).$promise.then(function(resp){
            $scope.pathologiesAndProducts = Success.getObject(resp);
            if(!letter){
                var arrayToUseForFilter = concatService.concatArrayProperties($scope.pathologiesAndProducts, 'products');
                $scope.firstLetters = FirstLetterService.firstLetters(arrayToUseForFilter, 'product_name');
            }
        });

    };

    $scope.getProducts();

    $scope.goToSpecialProduct = function (product) {
        $state.go('groupSpecialProduct.menuItem', {product_id: product._id}, {inherit: false,reload: true});
    }
}]);