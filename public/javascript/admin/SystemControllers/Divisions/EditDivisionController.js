controllers.controller('EditDivisionController', ['$scope', '$modalInstance', 'SystemService', '$modal', 'Success', 'division', 'DivisionsService', function ($scope, $modalInstance, SystemService, $modal, Success, division, DivisionsService) {
    $scope.division = division;
    $scope.closeModal = closeModal;
    $scope.updateDivision = updateDivision;
    var resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };
    function updateDivision(division) {
        if(!(division.code && division.confirmCode)) {
            resetAlert("danger", "Toate campurile sunt obligatorii");
        }
        else if(division.code != division.confirmCode){
            resetAlert("danger", "Codurile nu corespund");
        }
        else {
            DivisionsService.divisions.update({division: division}).$promise.then(function(res){
                resetAlert("success", "Codul a fost modificat");
            }).catch(function () {
                resetAlert("danger", "Eroare la schimbarea codului");
            });
        }

    }

    function closeModal() {
        $modalInstance.close();
    };
}]);