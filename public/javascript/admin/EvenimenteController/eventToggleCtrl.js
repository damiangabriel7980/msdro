cloudAdminControllers.controller('eventToggleController', ['$scope','EventsAdminService', '$modalInstance', 'isEnabled', 'idToToggle', '$state', function($scope, EventsAdminService, $modalInstance, isEnabled, idToToggle, $state){

    console.log(isEnabled);

    if(!isEnabled){
        $scope.title = "Publica eveniment";
        $scope.message = "Esti sigur ca doresti sa faci public evenimentul?";
    }else{
        $scope.title = "Dezactiveaza eveniment";
        $scope.message = "Esti sigur ca doresti sa dezactivezi evenimentul?";
    }

    $scope.toggleEventActive = function () {
        EventsAdminService.toggleEvent.save({data: {isEnabled: isEnabled, id: idToToggle}}).$promise.then(function (resp) {
            console.log(resp);
            if(resp.error){
                console.log("Eroare la update");
            }else{
                $state.reload();
                $modalInstance.close();
            }
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);