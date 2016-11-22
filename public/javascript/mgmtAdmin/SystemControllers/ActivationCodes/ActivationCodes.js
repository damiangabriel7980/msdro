controllers.controller('ActivationCodes', ['$scope', '$rootScope', '$state', '$stateParams','$filter', 'ngTableParams' ,'SystemService', '$modal', 'Success', function($scope, $rootScope, $state, $stateParams, $filter, ngTableParams, SystemService, $modal, Success){

    var refreshTable = function () {
        SystemService.codes.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);
            console.log(data);

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

    $scope.editActivationCode = function (code) {
        $modal.open({
            templateUrl: 'partials/admin/system/activationCodes/modalEditActivationCode.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditActivationCode',
            resolve:{
                code: function () {
                    return code;
                }
            }
        });
    };

}]);