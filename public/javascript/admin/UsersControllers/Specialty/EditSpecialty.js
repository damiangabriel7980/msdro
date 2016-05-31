controllers.controller('EditSpecialtyController', ['$scope', '$modalInstance', 'SystemService', '$modal', 'Success', 'specialty', 'ManageSpecialtyService', function ($scope, $modalInstance, SystemService, $modal, Success, specialty, ManageSpecialtyService) {
    $scope.specialty = specialty;
    $scope.closeModal = closeModal;
    $scope.updateSpecialty = updateSpecialty;
    var resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };
    function updateSpecialty(specialty){
        if(!specialty.name){
            resetAlert("danger", "Toate campurile sunt obligatorii");
        }
        else {
            ManageSpecialtyService.specialty.update({specialty: specialty}).$promise.then(function(res){
                resetAlert("success", "Specializarea a fost modificata");
            }).catch(function(err){
                resetAlert("danger", "Eroare la schimbarea specializarii")
            })
        }
    }
    function closeModal() {
        $modalInstance.close();
    };
}]);