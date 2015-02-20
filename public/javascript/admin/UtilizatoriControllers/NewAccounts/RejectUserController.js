controllers.controller('RejectUserController', ['$scope','NewAccountsService', '$modalInstance', 'idToReject', '$state', function($scope, NewAccountsService, $modalInstance, idToReject, $state){

    $scope.modal = {
        title: "Respinge utilizator",
        message: "Esti sigur ca doresti sa respingi utilizatorul?",
        affirmative: "Respinge",
        negative: "Renunta"
    };

    $scope.affirmative = function () {

        NewAccountsService.state.save({type: "REJECTED"}, {id: idToReject}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.negative = function(){
        $modalInstance.close();
    }

}]);