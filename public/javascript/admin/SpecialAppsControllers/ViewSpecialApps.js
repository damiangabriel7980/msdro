controllers.controller('ViewSpecialApps', ['$scope', '$rootScope', '$stateParams','$filter', 'ngTableParams' ,'SpecialAppsService', '$modal', function($scope, $rootScope, $stateParams, $filter, ngTableParams, SpecialAppsService, $modal){

    $scope.refreshTable = function () {
        SpecialAppsService.apps.query().$promise.then(function (resp) {
            var data = resp.success;

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };

    $scope.refreshTable();

    $scope.addSpecialApp = function(){
        $modal.open({
            templateUrl: 'partials/admin/content/specialApps/modalEditSpecialApp.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddSpecialApp'
        });
    };

    $scope.editSpecialApp = function (id) {
        //edit app
    };

    $scope.deleteSpecialApp = function (id) {
        //delete app
    };

    $scope.toggleSpecialProduct = function (id, enabled) {
        //toggle app
    }

}]);