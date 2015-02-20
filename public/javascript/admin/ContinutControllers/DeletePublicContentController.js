controllers.controller('DeletePublicContentController', ['$scope','publicContentService', '$modalInstance', '$state', 'idToDelete',function($scope, publicContentService, $modalInstance, $state, idToDelete){

    $scope.deleteContent = function () {
        console.log(idToDelete);
        publicContentService.deleteContent.save({id: idToDelete}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);