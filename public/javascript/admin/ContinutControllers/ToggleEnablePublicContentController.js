cloudAdminControllers.controller('ToggleEnablePublicContentController', ['$scope','publicContentService', '$modalInstance', 'isEnabled', 'idToToggle', '$state', function($scope, publicContentService, $modalInstance, isEnabled, idToToggle, $state){

    console.log(isEnabled);
    
    if(!isEnabled){
        $scope.title = "Publica continut";
        $scope.message = "Esti sigur ca doresti sa publici continutul?";
    }else{
        $scope.title = "Dezactiveaza continut";
        $scope.message = "Esti sigur ca doresti sa dezactivezi continutul?";
    }
    
    $scope.toggleContent = function () {
        publicContentService.toggleContent.save({data: {isEnabled: isEnabled, id: idToToggle}}).$promise.then(function (resp) {
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