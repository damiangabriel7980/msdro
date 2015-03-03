/**
 * Created by miricaandrei23 on 25.02.2015.
 */
controllers.controller('ViewAccount', ['$scope','ManageAccountsService', '$modalInstance', '$state','idToView','$timeout', function($scope, ManageAccountsService, $modalInstance, $state,idToView,$timeout){

    $scope.myAlert = {
        newAlert: false,
        type: "info",
        message: ""
    };

    ManageAccountsService.users.query({id: idToView}).$promise.then(function(resp){
        $scope.selectedUser = resp.success;
        console.log($scope.selectedUser);
        ManageAccountsService.professions.query().$promise.then(function (response) {
            $scope.professions = response;
            for(var i=0;i<$scope.professions.length;i++)
            {
                if($scope.selectedUser.profession._id===$scope.professions[i]._id)
                    $scope.selectedProfession=$scope.professions[i];
            }

        });
    });


    $scope.saveSuccess = false;

    $scope.saveModifiedUser=function(){
        ManageAccountsService.saveUser.save({id: $scope.selectedUser._id, name: $scope.selectedUser.name, username: $scope.selectedUser.username, professionId: $scope.selectedProfession._id}).$promise.then(function (message) {
            $scope.myAlert.type = message.type;
            $scope.myAlert.message = message.message;
            $scope.myAlert.newAlert = true;
            if(message.success){
                $scope.saveSuccess = true;
                $timeout(function(){
                    $modalInstance.close();
                    $state.reload();
                },2000);
            }
        });
    };

    $scope.closeModal=function(){
        $modalInstance.close();
        $state.reload();
    };

}]);