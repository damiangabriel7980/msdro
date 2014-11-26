/**
 * Created by andrei on 25.11.2014.
 */
cloudAdminControllers.controller('AddGroupController', ['$scope','GrupuriService', '$modalInstance', 'prevScope',function($scope, GrupuriService, $modalInstance, prevScope){

    $scope.selectedUsers = {};

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    GrupuriService.getAllUsers.query().$promise.then(function (resp) {
        console.log(resp);
        $scope.users = resp;
    });

    $scope.addGroup = function () {
        console.log(this);
        var toSend = {group:{},users:{}};
        toSend.group.display_name = this.nume;
        toSend.group.description = this.descriere;
        toSend.group.default_group = this.grupDefault?true:false;
        toSend.group.content_specific = this.content_specific?true:false;
        toSend.users = this.selectedUsers;
        GrupuriService.addGroup.save({data: toSend}).$promise.then(function (resp) {
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