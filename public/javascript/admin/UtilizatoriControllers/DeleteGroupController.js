controllers.controller('DeleteGroupController', ['$scope','GroupsService', '$modalInstance', 'idToDelete', '$state', function($scope, GroupsService, $modalInstance, idToDelete, $state){

    $scope.deleteGroup = function () {

        GroupsService.deleteGroup.save({id: idToDelete}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);