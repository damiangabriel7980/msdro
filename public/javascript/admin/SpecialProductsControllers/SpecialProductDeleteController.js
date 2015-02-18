cloudAdminControllers.controller('SpecialProductDeleteController', ['$scope', 'SpecialProductsService', 'AmazonService', '$modalInstance', 'idToDelete', '$state', function($scope, SpecialProductsService, AmazonService, $modalInstance, idToDelete, $state){

    $scope.modal = {
        title: "Sterge pagina produs",
        message: "Esti sigur ca doresti sa stergi pagina de produs?",
        action: "Sterge",
        alert: {}
    };

    var resetAlert = function (type, text) {
        $scope.modal.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    $scope.modalAction = function () {
        //delete images
        resetAlert("warning", "Va rugam asteptati...");
        SpecialProductsService.products.query({id: idToDelete}).$promise.then(function (resp) {
            if(!resp[0]){
                resetAlert("danger", "Nu s-a gasit produsul")
            }else{
                var header_key = resp[0].header_image;
                var logo_key = resp[0].logo_path;
                var toDelete = [];
                if(header_key) toDelete.push(header_key);
                if(logo_key) toDelete.push(logo_key);
                resetAlert("warning", "Se sterge produsul...");
                SpecialProductsService.products.delete({id: idToDelete}).$promise.then(function (resp) {
                    if(resp.error){
                        resetAlert("danger", "Eroare la stergerea produsului");
                    }else{
                        resetAlert("warning", "Se sterg imaginile...");
                        AmazonService.deleteFiles(toDelete, function (err, success) {
                            if(err){
                                console.log(err);
                                resetAlert("danger", "Eroare la stergerea imaginilor");
                            }else{
                                //success. close modal and refresh table by reloading state
                                $state.reload();
                                $modalInstance.close();
                            }
                        });
                    }
                });
            }
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);