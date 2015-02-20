controllers.controller('DeleteMedicCarouselController', ['$scope','CarouselMedicService', '$modalInstance', '$state', 'idToDelete',function($scope, CarouselMedicService, $modalInstance, $state, idToDelete){

    $scope.deleteImage = function () {
        console.log(idToDelete);
        CarouselMedicService.deleteImage.save({id: idToDelete}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);