controllers.controller('ToggleAccount', ['$scope','ManageAccountsService', '$modalInstance', '$state','idToEdit','enabledUser', function($scope, ManageAccountsService, $modalInstance, $state,idToEdit,enabledUser){

    $scope.enableDisable=function(){
        ManageAccountsService.toggleUser.save({id: idToEdit,enabled: !enabledUser}).$promise.then(function(user){
            console.log(user);
            $modalInstance.close();
            $state.reload();
        });
    };

    if(enabledUser==true)
        $scope.userStatus="Dezactiveaza";
    else
        $scope.userStatus="Activeaza";
    $scope.closeModal=function(){
        $modalInstance.close();
        $state.reload();
    };

}]);