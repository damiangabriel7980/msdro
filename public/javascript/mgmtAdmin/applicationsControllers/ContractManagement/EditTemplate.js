controllers.controller('EditTemplate', ['$scope', '$modalInstance', '$state', 'idToEdit', 'ContractManagementService', 'Success', function($scope, $modalInstance, $state, idToEdit, ContractManagementService, Success){

    var resetAlert = function (type, text) {
        $scope.alert = {
            show: text?true:false,
            type: type?type:"danger",
            text: text?text:"Unknown error"
        };
    };

    ContractManagementService.templates.query({id: idToEdit}).$promise.then(function (resp) {
        Success.getObject(resp);
    }).catch(function () {
        resetAlert("danger", "Eroare la gasirea template-ului");
    });
    
    $scope.updateTemplate = function () {
        var template = this.template;
        ContractManagementService.templates.update({id: template._id}, template).$promise.then(function () {
            $state.reload();
            $modalInstance.close();
        }).catch(function () {
            resetAlert("danger", "Eroare la update");
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

}]);