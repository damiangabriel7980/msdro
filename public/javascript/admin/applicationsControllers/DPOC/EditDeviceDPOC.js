controllers.controller('EditDeviceDPOC', ['$scope', '$state', '$modalInstance', 'DPOCService', 'idToEdit', function ($scope, $state, $modalInstance, DPOCService, idToEdit) {

    DPOCService.devices.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.device = resp.success;
    });

    $scope.modal = {
        title: "Modifica device",
        action: "Modifica",
        label_code: "Cod nou"
    };

    var resetAlert = function (type, text) {
        $scope.alert = {
            show: text?true:false,
            type: type?type:"danger",
            text: text?text:"Unknown error"
        };
    };

    $scope.action = function () {
        console.log(this.device);
        DPOCService.devices.update({id: idToEdit}, this.device).$promise.then(function (resp) {
            if(resp.error){
                resetAlert("danger", resp.error);
            }else{
                $state.reload();
                $modalInstance.close();
            }
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);