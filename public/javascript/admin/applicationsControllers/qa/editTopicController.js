controllers.controller('EditTopicController', ['$scope','qaService', '$modalInstance', '$state', 'idToEdit',function($scope, qaService, $modalInstance, $state, idToEdit){

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    qaService.topicById.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.name = resp.name;
    });

    $scope.editTopic = function () {

        qaService.topics.update({id: idToEdit, name: $scope.name}).$promise.then(function (resp) {
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