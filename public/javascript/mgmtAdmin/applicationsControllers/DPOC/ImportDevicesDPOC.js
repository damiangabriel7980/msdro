controllers.controller('ImportDevicesDPOC', ['$scope', '$state', '$modalInstance', 'parsedCSV', 'DPOCService', 'Error', function ($scope, $state, $modalInstance, parsedCSV, DPOCService, Error) {

    $scope.parsedCSV = parsedCSV;

    var resetAlert = function (type, text) {
        $scope.alert = {
            show: text?true:false,
            type: type?type:"danger",
            text: text?text:"Unknown error"
        };
    };

    $scope.importAll = function () {
        $scope.importedWithErrors = false;
        DPOCService.importDevices.create(parsedCSV.body).$promise.then(function () {
            $state.reload();
            $modalInstance.close();
        }).catch(function (resp) {
            resetAlert("danger", "Urmatoarele device-uri au suferit erori la import:");
            $scope.importedWithErrors = Error.getData(resp);
            $state.reload();
        });
        console.log(parsedCSV.body);
    }

}]);