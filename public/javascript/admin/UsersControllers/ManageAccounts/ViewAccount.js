/**
 * Created by miricaandrei23 on 25.02.2015.
 */
controllers.controller('ViewAccount', ['$scope','ManageAccountsService', '$modalInstance', '$state','idToView','$timeout', 'Success', 'Error', function($scope, ManageAccountsService, $modalInstance, $state,idToView,$timeout,Success,Error){

    var resetAlert = function (type, text) {
        $scope.myAlert = {
            newAlert: text?true:false,
            type: type?type:"danger",
            message: text?text:"Unknown error"
        };
    };

    $scope.user = {};

    $scope.routingRolesNames = ["admin", "manager", "reprezentant", null];

    ManageAccountsService.professions.query().$promise.then(function (response) {
        $scope.professions = Success.getObject(response);
    }).catch(function(err){
        resetAlert('danger',Error.getMessage(err));
    });

    ManageAccountsService.users.query({id: idToView}).$promise.then(function(resp){
        var user = Success.getObject(resp);
        $scope.user = user;
        if(!$scope.user.routing_role){
            $scope.user.routing_role = null;
        }
        $scope.$applyAsync();
        if(user.profession) $scope.selectedProfession = user.profession._id;
    }).catch(function(err){
        resetAlert('danger',Error.getMessage(err));
    });

    ManageAccountsService.groups.query().$promise.then(function (resp) {
        $scope.groups = Success.getObject(resp);
    }).catch(function(err){
        resetAlert('danger',Error.getMessage(err));
    });

    $scope.saveSuccess = false;

    $scope.saveModifiedUser=function(){
        var user = this.user;
        user.profession = this.selectedProfession;
        user.groupsID = this.selectedGroups;
        ManageAccountsService.users.update({id: user._id}, user).$promise.then(function (resp) {
            if(Success.getObject(resp).userExists) {
                resetAlert("warning", "Un utilizator cu acelasi e-mail exista deja");
            }else{
                resetAlert("success", "Update efectuat!");
                $scope.saveSuccess = true;
                $timeout(function(){
                    $modalInstance.close();
                    $state.reload();
                },2000);
            }
        }).catch(function(err){
            resetAlert('danger',Error.getMessage(err));
        });
    };

    $scope.routingRoleDisplayName = function (name) {
        switch(name){
            case "admin": return "Administrator"; break;
            case "manager": return "Manager"; break;
            case "reprezentant": return "Reprezentant"; break;
            default: return "Fara rol"; break;
        }
    };

    $scope.closeModal=function(){
        $modalInstance.close();
    };

}]);