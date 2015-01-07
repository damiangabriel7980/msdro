cloudAdminControllers.controller('AddAnswerGiverController', ['$scope','qaService', '$modalInstance', '$state', '$sce',function($scope, qaService, $modalInstance, $state, $sce){

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    $scope.medic = {};
    $scope.medic.selected = {};

    qaService.medics.query().$promise.then(function (resp) {
        console.log(resp);
        $scope.medics = resp;
    });

    $scope.addAnswerGiver = function () {

        qaService.answerGivers.save({nickname: this.nickname, id_user: $scope.medic.selected._id}).$promise.then(function (resp) {
            $scope.statusAlert.message = resp.message.text;
            $scope.statusAlert.type = resp.message.type;
            $scope.statusAlert.newAlert = true;
        });
    };

    $scope.trustAsHtml = function (val) {
        return $sce.trustAsHtml(val);
    };

    $scope.closeModal = function(){
        $state.reload();
        $modalInstance.close();
    }

}]);