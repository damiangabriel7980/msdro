cloudAdminControllers.controller('DeleteGroupController', ['$scope','GrupuriService', '$modalInstance', 'idToDelete', '$state', function($scope, GrupuriService, $modalInstance, idToDelete, $state){

    $scope.deleteGroup = function () {

        GrupuriService.deleteGroup.save({id: idToDelete}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);