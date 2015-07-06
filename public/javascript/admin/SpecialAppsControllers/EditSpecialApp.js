controllers.controller('EditSpecialApp', ['$scope','$rootScope' ,'SpecialAppsService', '$state', '$modalInstance', 'idToEdit', 'Success' , 'Error', function($scope, $rootScope, SpecialAppsService, $state, $modalInstance, idToEdit, Success, Error){

    $scope.modal = {
        title: "Modifica aplicatie",
        action: "Modifica"
    };

    //get app
    SpecialAppsService.apps.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.app = Success.getObject(resp);
    }).catch(function(err){
        resetAlert("Eroare", Error.getMessage(err));
    });

    //get special groups
    SpecialAppsService.groups.query().$promise.then(function (resp) {
        console.log(resp);
        $scope.specialGroups = Success.getObject(resp);
    }).catch(function(err){
        resetAlert("Eroare", Error.getMessage(err));
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
                $state.reload();
                $modalInstance.close();
        }).catch(function(err){
            resetAlert("Eroare", Error.getMessage(err));
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

}]);
