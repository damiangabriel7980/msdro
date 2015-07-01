/**
 * Created by miricaandrei23 on 25.02.2015.
 */
controllers.controller('ViewAccount', ['$scope','ManageAccountsService', '$modalInstance', '$state','idToView','$timeout', function($scope, ManageAccountsService, $modalInstance, $state,idToView,$timeout){

    var resetAlert = function (type, text) {
        $scope.myAlert = {
            newAlert: text?true:false,
            type: type?type:"danger",
            message: text?text:"Unknown error"
        };
    };

    ManageAccountsService.professions.query().$promise.then(function (response) {
        $scope.professions = response.success;
    });

    ManageAccountsService.users.query({id: idToView}).$promise.then(function(resp){
        var user = resp.success;
        $scope.user = user;
        if(user.profession) $scope.selectedProfession = user.profession._id;
    });

    ManageAccountsService.groups.query().$promise.then(function (resp) {
        $scope.groups = resp.success;
    });

    $scope.saveSuccess = false;

    $scope.saveModifiedUser=function(){
        var user = this.user;
        user.profession = this.selectedProfession;
        user.groupsID = this.selectedGroups;
        ManageAccountsService.users.update({id: user._id}, user).$promise.then(function (resp) {
            if(resp.error){
                resetAlert("danger", "Eroare la update");
            }else if(resp.userExists) {
                resetAlert("warning", "Un utilizator cu acelasi e-mail exista deja");
            }else{
                resetAlert("success", "Update efectuat!");
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
    };

}]);