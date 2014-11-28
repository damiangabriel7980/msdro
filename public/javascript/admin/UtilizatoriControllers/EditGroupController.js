cloudAdminControllers.controller('EditGroupController', ['$scope','GrupuriService', '$modalInstance', 'prevScope', 'idToEdit', function($scope, GrupuriService, $modalInstance, prevScope, idToEdit){

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    GrupuriService.groupDetails.query({id: idToEdit}).$promise.then(function (resp) {
        console.log(resp);
        $scope.nume = resp.display_name;
        $scope.descriere = resp.description;
        $scope.grupDefault = resp.default_group?(resp.default_group==1):false;
        $scope.contentSpecific = resp.content_specific?resp.content_specific:false;
        GrupuriService.getAllUsers.query().$promise.then(function (resp) {
            $scope.users = resp;
            GrupuriService.getAllUsersByGroup.query({id: idToEdit}).$promise.then(function (resp) {
                $scope.selectedUsers = resp;
                //selectedUsers is populated, but the list is not refreshed
                console.log(resp);
            });
        });
    });

    $scope.editGroup = function () {
        console.log(this);
        var toSend = {group:{},users:{}, edit: true};
        toSend.id = idToEdit;
        toSend.group.display_name = this.nume;
        toSend.group.description = this.descriere;
        toSend.group.default_group = this.grupDefault?1:0;
        toSend.group.content_specific = this.contentSpecific?true:false;
        toSend.users = this.selectedUsers;
        GrupuriService.editGroup.save({data: toSend}).$promise.then(function (resp) {
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
        prevScope.refreshTable();
        $modalInstance.close();
    }

}]);