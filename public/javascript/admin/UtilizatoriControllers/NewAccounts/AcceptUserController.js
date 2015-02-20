controllers.controller('AcceptUserController', ['$scope','NewAccountsService', '$modalInstance', 'idToAccept', '$state', function($scope, NewAccountsService, $modalInstance, idToAccept, $state){

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
        });
    };

    $scope.negative = function(){
        $modalInstance.close();
    }

}]);