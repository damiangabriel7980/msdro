controllers.controller('AddSpecialApp', ['$scope','$rootScope' ,'SpecialAppsService', '$state', '$modalInstance', 'Success', 'Error', function($scope, $rootScope, SpecialAppsService, $state, $modalInstance, Success, Error){

    $scope.modal = {
        title: "Adauga aplicatie",
        action: "Adauga"
    };

    $scope.app = {
        groups: {}
    };

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
        var toAdd = this.app;
        toAdd.groups = this.selectedSpecialGroups;
        SpecialAppsService.apps.create(toAdd).$promise.then(function (resp) {
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
