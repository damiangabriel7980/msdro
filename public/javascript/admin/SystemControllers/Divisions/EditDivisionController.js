controllers.controller('EditDivisionController', ['$scope', '$modalInstance', 'SystemService', '$modal', '$state', 'Success', 'division', 'DivisionsService', function ($scope, $modalInstance, SystemService, $modal, $state, Success, division, DivisionsService) {
    $scope.division = division;
    $scope.closeModal = closeModal;
    $scope.updateDivision = updateDivision;
    $scope.changeCode = {};
    var resetAlert = function (type, text) {
        $scope.alert = {
            type: type ? type : "danger",
            show: text ? true : false,
            text: text ? text : "Unknown error"
        }
    };

    function updateDivision(division) {
        if (!($scope.changeCode.code && $scope.changeCode.confirmCode)) {
            resetAlert("danger", "Toate campurile sunt obligatorii");
        }
        else if ($scope.changeCode.code != $scope.changeCode.confirmCode) {
            resetAlert("danger", "Codurile nu corespund");
        }
        else {
            DivisionsService.divisions.update({id: division._id}, {
                name: division.name,
                code: this.changeCode.code
            }).$promise.then(function (res) {
                resetAlert("success", "Codul a fost modificat");
            }).catch(function () {
                resetAlert("danger", "Eroare la schimbarea codului");
            });
        }

    }

    function closeModal() {
        $modalInstance.close();
        $state.reload()
    };
}]);