controllers.controller('ModalGenerateQR', ['$scope', '$modalInstance', 'qrObject', function ($scope, $modalInstance, qrObject) {

    $scope.qrString = JSON.stringify(qrObject);

    $scope.closeQrModal = function () {
        $modalInstance.close();
    }

}]);