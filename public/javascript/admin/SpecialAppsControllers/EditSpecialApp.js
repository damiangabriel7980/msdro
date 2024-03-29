controllers.controller('EditSpecialApp', ['$scope','$rootScope' ,'SpecialAppsService', '$state', '$modalInstance', 'idToEdit', 'Success', function($scope, $rootScope, SpecialAppsService, $state, $modalInstance, idToEdit, Success){

    $scope.modal = {
        title: "Modifica aplicatie",
        action: "Modifica"
    };

    $scope.app = {};

    //get app
    SpecialAppsService.apps.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.app = Success.getObject(resp);
        $scope.$applyAsync();
    });

    //get special groups
    SpecialAppsService.groups.query().$promise.then(function (resp) {
        $scope.specialGroups = Success.getObject(resp);
    });

    var resetAlert = function (type, message) {
        $scope.statusAlert = {
            newAlert:message?true:false,
            type:type,
            message:message
        };
    };

    $scope.logoChanged = function (key, deleteItem) {
        deleteItem ? $scope.app.logo_path = null : $scope.app.logo_path = key;
        $scope.finalize();
    };


    $scope.finalize = function(close){
        var toEdit = this.app;
        toEdit.groups = this.selectedSpecialGroups;
        console.log(toEdit);
        SpecialAppsService.apps.update({id: toEdit._id}, toEdit).$promise.then(function (resp) {
            if(close){
                $state.reload();
                $modalInstance.close();
            } else {
                console.log(resp);
            }
        }).catch(function () {
            resetAlert("danger", "Eroare la modificarea aplicatiei");
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

}]);
