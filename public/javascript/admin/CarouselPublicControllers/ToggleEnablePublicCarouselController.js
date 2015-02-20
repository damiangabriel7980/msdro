controllers.controller('ToggleEnablePublicCarouselController', ['$scope','CarouselPublicService', '$modalInstance', 'isEnabled', 'idToToggle', '$state', function($scope, CarouselPublicService, $modalInstance, isEnabled, idToToggle, $state){

    console.log(isEnabled);

    if(!isEnabled){
        $scope.title = "Publica imagine";
        $scope.message = "Esti sigur ca doresti sa publici imaginea?";
    }else{
        $scope.title = "Dezactiveaza imagine";
        $scope.message = "Esti sigur ca doresti sa dezactivezi imaginea?";
    }

    $scope.toggleImage = function () {
        CarouselPublicService.toggleImage.save({data: {isEnabled: isEnabled, id: idToToggle}}).$promise.then(function (resp) {
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