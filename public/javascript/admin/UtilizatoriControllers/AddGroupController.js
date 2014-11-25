/**
 * Created by andrei on 25.11.2014.
 */
cloudAdminControllers.controller('AddGroupController', ['$scope','GrupuriService', '$modalInstance', function($scope, GrupuriService, $modalInstance){

    $scope.selectedUsers = {};

    GrupuriService.getAllUsers.query().$promise.then(function (resp) {
        console.log(resp);
        $scope.users = resp;
    });

    $scope.addGroup = function () {
        console.log(this);
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    }

}]);