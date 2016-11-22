controllers.controller('AddDeviceDPOC', ['$scope', '$state', '$modalInstance', 'DPOCService', 'Error', function ($scope, $state, $modalInstance, DPOCService, Error) {

    $scope.modal = {
        title: "Adauga device",
        action: "Adauga",
        label_code: "Cod"
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
        DPOCService.devices.create(this.device).$promise.then(function () {
            $state.reload();
            $modalInstance.close();
        }).catch(function (resp) {
            resetAlert("danger", Error.getMessage(resp));
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);