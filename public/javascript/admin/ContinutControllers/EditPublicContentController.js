cloudAdminControllers.controller('EditPublicContentController', ['$scope','ContinutPublicService', '$modalInstance', 'prevScope',function($scope, ContinutPublicService, $modalInstance, prevScope){

    $scope.closeModal = function(){
        prevScope.refreshTable();
        $modalInstance.close();
    }

}]);