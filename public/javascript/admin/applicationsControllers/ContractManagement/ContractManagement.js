controllers.controller('ContractManagement', ['$scope', 'ContractManagementService', 'ngTableParams', '$filter', function ($scope, ContractManagementService, ngTableParams, $filter) {
    ContractManagementService.templates.query().$promise.then(function(resp){
        var events = resp.success;
        var params = {
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter: {
                name: ''       // initial filter
            }
        };
        $scope.tableParams = new ngTableParams(params, {
            total: events.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(events, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
}]);