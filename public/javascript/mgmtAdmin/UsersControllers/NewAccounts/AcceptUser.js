controllers.controller('AcceptUser', ['$scope','NewAccountsService', '$modalInstance', 'idToAccept', '$state', 'Success', 'Error', function($scope, NewAccountsService, $modalInstance, idToAccept, $state, Success, Error){

    $scope.modal = {
        title: "Accepta utilizator",
        message: "Esti sigur ca doresti sa accepti utilizatorul?",
        affirmative: "Accepta",
        negative: "Renunta"
    };

    $scope.affirmative = function () {

        NewAccountsService.state.save({type: "ACCEPTED"}, {id: idToAccept}).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.negative = function(){
        $modalInstance.close();
    }

}]);