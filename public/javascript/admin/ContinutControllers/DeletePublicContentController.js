cloudAdminControllers.controller('DeletePublicContentController', ['$scope','ContinutPublicService', '$modalInstance', 'prevScope',function($scope, ContinutPublicService, $modalInstance, prevScope){

    $scope.closeModal = function(){
        prevScope.refreshTable();
        $modalInstance.close();
    }

}]);