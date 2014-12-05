cloudAdminControllers.controller('DeletePublicContentController', ['$scope','ContinutPublicService', '$modalInstance', '$state',function($scope, ContinutPublicService, $modalInstance, $state){

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);