controllers.controller('EnableProductPage', ['$scope', 'SpecialProductsService', '$modalInstance', 'idToToggle', 'isEnabled', '$state', function($scope, SpecialProductsService, $modalInstance, idToToggle, isEnabled, $state){

    $scope.modal = {
        title: isEnabled?"Ascunde pagina produs":"Publica pagina produs",
        message: isEnabled?"Esti sigur ca doresti sa ascunzi pagina de produs?":"Esti sigur ca doresti sa publici pagina de produs?",
        action: isEnabled?"Ascunde":"Publica",
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
        SpecialProductsService.products.update({id: idToToggle}, {enabled: !isEnabled}).$promise.then(function () {
            $state.reload();
            $modalInstance.close();
        }).catch(function () {
            resetAlert("danger","A aparut o eroare pe server");
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);