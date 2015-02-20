controllers.controller('SpecialProductDeleteController', ['$scope', 'SpecialProductsService', 'AmazonService', '$modalInstance', 'idToDelete', '$state', function($scope, SpecialProductsService, AmazonService, $modalInstance, idToDelete, $state){

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
                    if(resp.error){
                        resetAlert("danger", resp.message);
                    }else{
                        $scope.actionCompleted = true;
                        resetAlert("success", resp.message+"S-au sters "+imageDeleteCount+" imagini");
                    }
                });
            }
        });
    };

    $scope.closeModal = function(){
        if($scope.actionCompleted) $state.reload();
        $modalInstance.close();
    }

}]);