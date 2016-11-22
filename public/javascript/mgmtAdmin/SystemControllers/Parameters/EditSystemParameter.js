controllers.controller('EditSystemParameter', ['$scope', '$state', '$modalInstance', 'parameter', 'SystemService', function ($scope, $state, $modalInstance, parameter, SystemService) {

    $scope.parameter = parameter;

    var resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };

    $scope.closeModal = function () {
        $modalInstance.close();
        $state.reload();
    };

    $scope.updateParameter = function () {
        SystemService.parameters.update({id: this.parameter._id}, this.parameter).$promise.then(function () {
            resetAlert("success", "Parametrul a fost modificat");
        }).catch(function () {
            resetAlert("danger", "Eroare la schimbarea parametrului");
        });
    }

}]);