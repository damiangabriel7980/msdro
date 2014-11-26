cloudAdminControllers.controller('DeleteGroupController', ['$scope','GrupuriService', '$modalInstance', 'idToDelete', 'prevScope', function($scope, GrupuriService, $modalInstance, idToDelete, prevScope){

    $scope.deleteGroup = function () {

        GrupuriService.deleteGroup.save({id: idToDelete}).$promise.then(function (resp) {
            console.log(resp);
            $modalInstance.close();
            prevScope.refreshTable();
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);