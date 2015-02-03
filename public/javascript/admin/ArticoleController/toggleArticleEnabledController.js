cloudAdminControllers.controller('ToggleArticleEnabledController', ['$scope' ,'ContentService','$modalInstance','$state', 'idToToggle', 'isEnabled', function($scope,ContentService,$modalInstance,$state,idToToggle,isEnabled){

    if(isEnabled){
        $scope.title = "Dezactiveaza articol";
        $scope.message = "Esti sigur ca doresti sa dezactivezi articolul?";
        $scope.action = "Dezactiveaza";
    }else{
        $scope.title = "Publica articol";
        $scope.message = "Esti sigur ca doresti sa publici articolul?";
        $scope.action = "Publica";
    }

    $scope.toggle=function(){
        console.log(isEnabled);
        ContentService.deleteOrUpdateContent.update({id:idToToggle}, {enable: !isEnabled}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

}]);
