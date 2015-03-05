controllers.controller('EditSpecialApp', ['$scope','$rootScope' ,'SpecialAppsService', '$state', '$modalInstance', 'idToEdit', function($scope, $rootScope, SpecialAppsService, $state, $modalInstance, idToEdit){

    $scope.modal = {
        title: "Modifica aplicatie",
        action: "Modifica"
    };

    //get app
    SpecialAppsService.apps.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.app = resp.success;
    });

    //get special groups
    SpecialAppsService.groups.query().$promise.then(function (resp) {
        console.log(resp);
        $scope.specialGroups = resp.success;
    });

    var resetAlert = function (type, message) {
        $scope.statusAlert = {
            newAlert:message?true:false,
            type:type,
            message:message
        };
    };

    $scope.finalize = function(){
        var toEdit = this.app;
        toEdit.groups = this.selectedSpecialGroups;
        console.log(toEdit);
        SpecialAppsService.apps.update({id: toEdit._id}, toEdit).$promise.then(function (resp) {
            if(resp.error){
                resetAlert("danger", "Eroare la modificarea aplicatiei");
            }else{
                $state.reload();
                $modalInstance.close();
            }
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

}]);
