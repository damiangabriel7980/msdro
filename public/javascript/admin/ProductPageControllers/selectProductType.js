/**
 * Created by andrei.mirica on 26/07/16.
 */
controllers.controller('SelectProductType', ['$scope', 'SpecialProductsService', '$state', '$modalInstance', function($scope, SpecialProductsService, $state, $modalInstance) {
    $scope.productTypeDisplayNames = ["product", "resource"];

    $scope.productTypeDisplayName = function (name) {
        switch (name) {
            case "product":
                return "Pagina produs";
                break;
            case "resource":
                return "Pagina resursa";
                break;
        }
    };

    $scope.saveSpecialProduct = function () {
        SpecialProductsService.products.create({productType: $scope.selectedPageType}).$promise.then(function (resp) {
            $modalInstance.close();
            $state.reload();
        }).catch(function (err) {
            console.log(Error.getMessage(err));
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };
}]);