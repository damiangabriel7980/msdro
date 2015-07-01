controllers.controller('NewAccounts', ['$scope', 'NewAccountsService', function($scope, NewAccountsService){

    $scope.count = {
        ACCEPTED: 0,
        REJECTED: 0,
        PENDING: 0
    };

    NewAccountsService.count.query().$promise.then(function (resp) {
        for(var i=0; i<resp.success.length; i++){
            $scope.count[resp.success[i]._id] = resp.success[i].total;
        }
        console.log($scope.count);
    });

}]);