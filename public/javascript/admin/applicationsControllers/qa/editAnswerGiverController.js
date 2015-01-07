cloudAdminControllers.controller('EditAnswerGiverController', ['$scope','qaService', '$modalInstance', '$state', 'idToEdit',function($scope, qaService, $modalInstance, $state, idToEdit){

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    qaService.answerGiverById.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.nickname = resp.nickname;
    });

    $scope.editAnswerGiver = function () {

        qaService.answerGivers.update({id: idToEdit, nickname: $scope.nickname}).$promise.then(function (resp) {
            $scope.statusAlert.message = resp.message.text;
            $scope.statusAlert.type = resp.message.type;
            $scope.statusAlert.newAlert = true;
        });
    };

    $scope.closeModal = function(){
        $state.reload();
        $modalInstance.close();
    }

}]);