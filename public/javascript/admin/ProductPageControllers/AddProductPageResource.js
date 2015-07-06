controllers.controller('AddProductPageResource', ['$scope', 'SpecialProductsService', 'Success', function($scope, SpecialProductsService, Success) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    $scope.newItem = {product: $scope.sessionData.idToEdit};

    $scope.addResource = function () {
        SpecialProductsService.resources.create($scope.newItem).$promise.then(function (resp) {
            $scope.sessionData.resourceToEdit = Success.getObject(resp).saved;
            $scope.renderView("editResource");
        }).catch(function () {
            $scope.resetAlert("danger", "Eroare la adaugare");
        });
    }

}]);