controllers.controller('CrudProductPageGlossary', ['$scope', 'SpecialProductsService', 'Success', 'Error', function($scope, SpecialProductsService,Success,Error) {

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
                $scope.renderView("viewGlossary");
        }).catch(function(err){
            $scope.resetAlert("danger", Error.getMessage(err));
        });
    };

    $scope.editGlossaryTerm = function () {
        var id = $scope.currentItem._id;
        if(!id){
            $scope.resetAlert("Nu a fost gasit termenul");
        }else{
            SpecialProductsService.glossary.update({id: id}, $scope.currentItem).$promise.then(function (resp) {
                    $scope.renderView("viewGlossary");
            }).catch(function(err){
                $scope.resetAlert("danger", Error.getMessage(err));
            });
        }
    };

}]);