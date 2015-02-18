cloudAdminControllers.controller('SpecialProductCrudGlossaryController', ['$scope', 'SpecialProductsService', function($scope, SpecialProductsService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    //initialize the item to add / edit
    $scope.newItem = {};
    if($scope.sessionData.glossaryToEdit){
        $scope.currentItem = $scope.sessionData.glossaryToEdit;
    }else{
        $scope.currentItem = {};
    }
    //attach current product to new item
    $scope.newItem.product = $scope.sessionData.idToEdit;

    $scope.addGlossaryTerm = function () {
        console.log(this.newItem);
        SpecialProductsService.glossary.create(this.newItem).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", resp.error);
            }else{
                $scope.renderView("viewGlossary");
            }
        });
    };

    $scope.editGlossaryTerm = function () {
        var id = $scope.currentItem._id;
        if(!id){
            $scope.resetAlert("Nu a fost gasit termenul");
        }else{
            SpecialProductsService.glossary.update({id: id}, $scope.currentItem).$promise.then(function (resp) {
                if(resp.error){
                    $scope.resetAlert("danger", resp.error);
                }else{
                    $scope.renderView("viewGlossary");
                }
            });
        }
    };

}]);