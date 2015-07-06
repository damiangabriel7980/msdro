controllers.controller('AddSpecialApp', ['$scope','$rootScope' ,'SpecialAppsService', '$state', '$modalInstance', 'Success', function($scope, $rootScope, SpecialAppsService, $state, $modalInstance, Success){

    $scope.modal = {
        title: "Adauga aplicatie",
        action: "Adauga"
    };

    $scope.app = {
        groups: {}
    };

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

    $scope.finalize = function(){
        var toAdd = this.app;
        toAdd.groups = this.selectedSpecialGroups;
        SpecialAppsService.apps.create(toAdd).$promise.then(function () {
            $state.reload();
            $modalInstance.close();
        }).catch(function () {
            resetAlert("danger", "Eroare la cerarea aplicatiei");
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

}]);
