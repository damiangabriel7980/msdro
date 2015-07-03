controllers.controller('RejectUser', ['$scope','NewAccountsService', '$modalInstance', 'idToReject', '$state', 'Success', 'Error', function($scope, NewAccountsService, $modalInstance, idToReject, $state, Success, Error){

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
        }).catch(function(err){
            console.log(Error.getMessage(err.data));
        });
    };

    $scope.negative = function(){
        $modalInstance.close();
    }

}]);