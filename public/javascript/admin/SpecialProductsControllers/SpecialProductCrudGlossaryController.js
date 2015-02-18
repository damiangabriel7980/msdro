cloudAdminControllers.controller('SpecialProductCrudGlossaryController', ['$scope', 'SpecialProductsService', function($scope, SpecialProductsService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //initialize the new item to add
    $scope.newItem = {};
    //attach current product
    $scope.newItem.product = $scope.sessionData.idToEdit;

    $scope.addGlossaryTerm = function () {
        console.log(this.newItem);
        SpecialProductsService.glossary.create(this.newItem).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", resp.error);
            }else{
                $scope.renderView("editGlossary");
            }
        });
    }

}]);