controllers.controller('DeletePublicCarouselController', ['$scope','CarouselPublicService', '$modalInstance', '$state', 'idToDelete',function($scope, CarouselPublicService, $modalInstance, $state, idToDelete){

    $scope.deleteImage = function () {
        console.log(idToDelete);
        CarouselPublicService.deleteImage.save({id: idToDelete}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);