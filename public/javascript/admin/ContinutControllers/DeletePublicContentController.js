cloudAdminControllers.controller('DeletePublicContentController', ['$scope','ContinutPublicService', '$modalInstance', '$state', 'idToDelete',function($scope, ContinutPublicService, $modalInstance, $state, idToDelete){

    $scope.deleteContent = function () {
        console.log(idToDelete);
        ContinutPublicService.deleteContent.save({id: idToDelete}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);