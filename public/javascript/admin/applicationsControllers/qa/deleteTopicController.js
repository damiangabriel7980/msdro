controllers.controller('DeleteTopicController', ['$scope','qaService', '$modalInstance', '$state', 'idToDelete',function($scope, qaService, $modalInstance, $state, idToDelete){

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    $scope.deleteTopic = function () {

        qaService.topicById.delete({id: idToDelete}).$promise.then(function (resp) {
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