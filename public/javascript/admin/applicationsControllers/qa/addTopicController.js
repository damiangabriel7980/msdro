cloudAdminControllers.controller('AddTopicController', ['$scope','qaService', '$modalInstance', '$state',function($scope, qaService, $modalInstance, $state){

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    $scope.addTopic = function () {

        qaService.topics.save({name: $scope.name}).$promise.then(function (resp) {
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