controllers.controller('ImportDevicesDPOC', ['$scope', '$state', '$modalInstance', 'parsedCSV', 'DPOCService', function ($scope, $state, $modalInstance, parsedCSV, DPOCService) {

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
        DPOCService.importDevices.create(parsedCSV.body).$promise.then(function (resp) {
            if(resp.success){
                $state.reload();
                $modalInstance.close();
            }else if(resp.error){
                console.log(resp.error);
                resetAlert("danger", "Urmatoarele device-uri au suferit erori la import:");
                $scope.importedWithErrors = resp.error;
            }else{
                resetAlert("danger", "A aparut o eroare pe server");
            }
        });
        console.log(parsedCSV.body);
    }

}]);