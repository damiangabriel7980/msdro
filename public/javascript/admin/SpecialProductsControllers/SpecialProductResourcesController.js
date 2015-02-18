cloudAdminControllers.controller('SpecialProductResourcesController', ['$scope', 'SpecialProductsService', 'ngTableParams', '$filter', function($scope, SpecialProductsService, ngTableParams, $filter) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    $scope.refreshTable = function () {
        SpecialProductsService.resources.query({product: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", "Eroare la gasire glosar");
            }else{
                console.log(resp);
                var data = resp.resources;
                $scope.resourcesTableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 10,          // count per page
                    sorting: {
                        filename: 'asc'     // initial sorting
                    },
                    filter: {
                        filename: ''       // initial filter
                    }
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {

                        var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
            }
        });
    };

    $scope.refreshTable();

    $scope.addResource = function () {
        $scope.renderView("addResource");
    };

    $scope.editResource = function (item) {
        $scope.sessionData.resourceToEdit = item;
        $scope.renderView("editResource");
    };

    $scope.deleteResource = function (id) {
        //TODO: delete Resource
    };

}]);