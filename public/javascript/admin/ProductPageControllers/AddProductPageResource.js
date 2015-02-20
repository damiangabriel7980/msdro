controllers.controller('AddProductPageResource', ['$scope', 'SpecialProductsService', function($scope, SpecialProductsService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    $scope.newItem = {product: $scope.sessionData.idToEdit};

    $scope.addResource = function () {
        SpecialProductsService.resources.create($scope.newItem).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", "Eroare la adaugare");
            }else{
                $scope.sessionData.resourceToEdit = resp.saved;
                $scope.renderView("editResource");
            }
        });
    }

}]);