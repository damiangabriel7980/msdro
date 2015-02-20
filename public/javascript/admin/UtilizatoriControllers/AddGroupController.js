/**
 * Created by andrei on 25.11.2014.
 */
controllers.controller('AddGroupController', ['$scope','GroupsService', '$modalInstance', '$state',function($scope, GroupsService, $modalInstance, $state){

    $scope.selectedUsers = [];

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    GroupsService.getAllUsers.query().$promise.then(function (resp) {
        console.log(resp);
        $scope.users = resp;
    });

    GroupsService.getProfessions.query().$promise.then(function (resp) {
        $scope.professions = resp;
    });

    $scope.addGroup = function () {
        console.log(this);
        var toSend = {group:{},users:{}};
        toSend.group.display_name = this.nume;
        toSend.group.description = this.descriere;
        toSend.group.default_group = this.grupDefault?1:0;
        toSend.group.content_specific = this.contentSpecific?true:false;
        toSend.group.profession = this.selectedProfession?this.selectedProfession._id:null;
        toSend.users = this.arrayUsers || [];
        GroupsService.addGroup.save({data: toSend}).$promise.then(function (resp) {
            $scope.statusAlert.message = resp.message;
            if(resp.error){
                $scope.statusAlert.type = "danger";
            }else{
                $scope.statusAlert.type = "success";
            }
            $scope.statusAlert.newAlert = true;
        });
    };

    $scope.closeModal = function(){
        $state.reload();
        $modalInstance.close();
    }

}]);