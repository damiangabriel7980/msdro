controllers.controller('DeleteProductPage', ['$scope', 'SpecialProductsService', 'AmazonService', '$modalInstance', 'idToDelete', '$state', 'Error', 'Success', function($scope, SpecialProductsService, AmazonService, $modalInstance, idToDelete, $state, Error, Success){

    $scope.modal = {
        title: "Sterge pagina produs",
        message: "Esti sigur ca doresti sa stergi pagina de produs?",
        action: "Sterge",
        alert: {}
    };

    $scope.actionCompleted = false;

    var resetAlert = function (type, text) {
        $scope.modal.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    $scope.modalAction = function () {
        //delete all images at path
        resetAlert("warning","Se sterg fisierele atasate...");
        AmazonService.deleteFilesAtPath("productPages/"+idToDelete, function (err, imageDeleteCount) {
            if(err){
                resetAlert("danger", "Eroare la stergerea fiserelor atasate");
            }else{
                //delete product and every menu items attached to it
                resetAlert("warning", "Se sterge produsul...");
                SpecialProductsService.products.delete({id: idToDelete}).$promise.then(function (resp) {
                    $scope.actionCompleted = true;
                    resetAlert("success", Success.getMessage(resp) + ". S-au sters "+imageDeleteCount+" imagini");
                }).catch(function (resp) {
                    resetAlert("danger", Error.getMessage(resp));
                });
            }
        });
    };

    $scope.closeModal = function(){
        if($scope.actionCompleted) $state.reload();
        $modalInstance.close();
    }

}]);