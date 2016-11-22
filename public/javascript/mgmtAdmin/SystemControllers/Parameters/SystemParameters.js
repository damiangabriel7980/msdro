controllers.controller('SystemParameters', ['$scope', 'SystemService', 'ngTableParams', '$filter', '$modal', 'Success', function ($scope, SystemService, ngTableParams, $filter, $modal, Success) {

    var refreshTable = function () {
        SystemService.parameters.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10          // count per page
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };
    refreshTable();

    $scope.editParam = function (param) {
        $modal.open({
            templateUrl: 'partials/admin/system/parameters/modalEditSystemParameter.html',
            windowClass: 'fade',
            controller: 'EditSystemParameter',
            resolve:{
                parameter: function () {
                    return param;
                }
            }
        });
    };

}]);