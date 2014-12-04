cloudAdminControllers.controller('ToggleEnablePublicContentController', ['$scope','ContinutPublicService', '$modalInstance', 'prevScope', 'isEnabled', function($scope, ContinutPublicService, $modalInstance, prevScope, isEnabled){

    console.log(isEnabled);

    $scope.closeModal = function(){
        prevScope.refreshTable();
        $modalInstance.close();
    }

}]);