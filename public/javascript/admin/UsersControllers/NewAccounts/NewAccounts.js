controllers.controller('NewAccounts', ['$scope', 'NewAccountsService', function($scope, NewAccountsService){

    $scope.count = {
        ACCEPTED: 0,
        REJECTED: 0,
        PENDING: 0
    };

    NewAccountsService.count.query().$promise.then(function (resp) {
        for(var i=0; i<resp.length; i++){
            $scope.count[resp[i]._id] = resp[i].total;
        }
        console.log($scope.count);
    });

}]);