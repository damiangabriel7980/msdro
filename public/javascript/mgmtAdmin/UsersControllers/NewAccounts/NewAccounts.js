controllers.controller('NewAccounts', ['$scope', 'NewAccountsService', 'Success', 'Error', function($scope, NewAccountsService, Success, Error){

    $scope.count = {
        ACCEPTED: 0,
        REJECTED: 0,
        PENDING: 0
    };

    NewAccountsService.count.query().$promise.then(function (resp) {
        for(var i=0; i<Success.getObject(resp).length; i++){
            $scope.count[Success.getObject(resp)[i]._id] = Success.getObject(resp)[i].total;
        }
        console.log($scope.count);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

}]);