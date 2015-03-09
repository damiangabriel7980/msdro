controllers.controller('EditActivationCode', ['$scope', '$state', '$modalInstance', 'code', 'SystemService', function ($scope, $state, $modalInstance, code, SystemService) {

    $scope.code = code;

    $scope.changeCode = {};

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

    $scope.updateActivationCode = function () {
        if(!(this.changeCode.old && this.changeCode.new && this.changeCode.confirm)){
            resetAlert("danger", "Toate campurile sunt obligatorii");
        }else if(this.changeCode.new != this.changeCode.confirm){
            resetAlert("danger", "Codurile nu corespund");
        }else{
            SystemService.codes.update({id: code._id}, this.changeCode).$promise.then(function (resp) {
                if(resp.error){
                    resetAlert("danger", "Codul vechi nu a putut fi verificat");
                }else{
                    resetAlert("success", "Codul a fost modificat");
                }
            });
        }
    }

}]);