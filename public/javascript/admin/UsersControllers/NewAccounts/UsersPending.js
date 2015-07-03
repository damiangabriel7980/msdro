controllers.controller('UsersPending', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$modal', 'NewAccountsService', 'Success', 'Error', function($scope, $rootScope, $filter, ngTableParams, $modal, NewAccountsService, Success, Error){

    NewAccountsService.state.query({type: "PENDING"}).$promise.then(function (data) {
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                username: 'asc'     // initial sorting
            },
            filter: {
                username: ''       // initial filter
            }
        }, {
            total: Success.getObject(data).length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(Success.getObject(data), params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });

    $scope.accept = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/users/newAccounts/modalAreYouSure.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'AcceptUser',
            resolve: {
                idToAccept: function () {
                    return id;
                }
            }
        });
    };

    $scope.reject = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/users/newAccounts/modalAreYouSure.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'RejectUser',
            resolve: {
                idToReject: function () {
                    return id;
                }
            }
        });
    };

}]);