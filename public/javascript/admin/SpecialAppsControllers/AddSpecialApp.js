controllers.controller('AddSpecialApp', ['$scope','$rootScope' ,'SpecialAppsService', '$state', '$modalInstance', function($scope, $rootScope, SpecialAppsService, $state, $modalInstance){

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
        var toAdd = this.app;
        toAdd.groups = this.selectedSpecialGroups;
        SpecialAppsService.apps.create(toAdd).$promise.then(function (resp) {
            if(resp.error){
                resetAlert("danger", "Eroare la cerarea aplicatiei");
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
