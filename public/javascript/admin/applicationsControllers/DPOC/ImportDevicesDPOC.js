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
        DPOCService.importDevices.create(parsedCSV.body).$promise.then(function (resp) {
            if(resp.success){
                $state.reload();
                $modalInstance.close();
            }else{
                resetAlert("danger", resp.error);
            }
        });
        console.log(parsedCSV.body);
    }

}]);