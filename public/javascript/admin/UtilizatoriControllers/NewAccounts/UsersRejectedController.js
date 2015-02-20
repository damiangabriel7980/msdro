controllers.controller('UsersRejectedController', ['$scope', '$rootScope', '$filter', 'ngTableParams', '$modal', 'NewAccountsService', function($scope, $rootScope, $filter, ngTableParams, $modal, NewAccountsService){

    NewAccountsService.state.query({type: "REJECTED"}).$promise.then(function (data) {
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
            total: data.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.accept = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/utilizatori/conturiNoi/modalAreYouSure.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'AcceptUserController',
            resolve: {
                idToAccept: function () {
                    return id;
                }
            }
        });
    };

}]);