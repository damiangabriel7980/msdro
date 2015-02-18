cloudAdminControllers.controller('SpecialProductGlossaryController', ['$scope', 'SpecialProductsService', 'ngTableParams', '$filter', function($scope, SpecialProductsService, ngTableParams, $filter) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    $scope.refreshTable = function () {
        SpecialProductsService.glossary.query({product: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
            if(resp.error){
                $scope.resetAlert("danger", "Eroare la gasire glosar");
            }else{
                console.log(resp);
                var data = resp.glossary;
                $scope.glossaryTableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 10,          // count per page
                    sorting: {
                        keyword: 'asc'     // initial sorting
                    },
                    filter: {
                        keyword: ''       // initial filter
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

    $scope.addTerm = function () {
        //TODO: add term
    };

    $scope.editTerm = function (id) {
        //TODO: edit term
    };

    $scope.deleteTerm = function (id) {
        //TODO: delete term
    };

}]);