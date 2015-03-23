controllers.controller('AddDeviceDPOC', ['$scope', '$state', '$modalInstance', 'DPOCService', function ($scope, $state, $modalInstance, DPOCService) {

    $scope.modal = {
        title: "Adauga device",
        action: "Adauga"
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
        DPOCService.devices.create(this.device).$promise.then(function (resp) {
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