controllers.controller('ProductPageGlossary', ['$scope', 'SpecialProductsService', 'ngTableParams', '$filter', 'Success', 'Error', function($scope, SpecialProductsService, ngTableParams, $filter, Success, Error) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    var refreshGlossaryTable = function () {
        SpecialProductsService.glossary.query({product: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
            var data = Success.getObject(resp);
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
                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        }).catch(function () {
            $scope.resetAlert("danger", "Eroare la gasire glosar");
        });
    };

    refreshGlossaryTable();

    $scope.addTerm = function () {
        $scope.sessionData.glossaryToEdit = null;
        $scope.renderView('addGlossaryTerm');
    };

    $scope.editTerm = function (term) {
        $scope.sessionData.glossaryToEdit = term;
        $scope.renderView('editGlossaryTerm');
    };

    $scope.deleteTerm = function (id) {
        SpecialProductsService.glossary.delete({id: id}).$promise.then(function () {
            refreshGlossaryTable();
        }).catch(function (resp) {
            $scope.resetAlert("danger", Error.getMessage(resp));
        });
    };

}]);