controllers.controller('ProductPageResources', ['$scope', 'SpecialProductsService', 'ngTableParams', '$filter', 'AmazonService', 'Success', 'Error', function($scope, SpecialProductsService, ngTableParams, $filter, AmazonService, Success, Error) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    var refreshTable = function () {
        SpecialProductsService.resources.query({product: $scope.sessionData.idToEdit}).$promise.then(function (resp) {
            var data = Success.getObject(resp).resources;
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

    refreshTable();

    $scope.addResource = function () {
        $scope.renderView("addResource");
    };

    $scope.editResource = function (item) {
        $scope.sessionData.resourceToEdit = item;
        $scope.renderView("editResource");
    };

    $scope.deleteResource = function (item) {
        $scope.resetAlert("warning", "Se sterge fisierul...");
        //first, delete image
        AmazonService.deleteFile(item.file_path, function (err, success) {
            if(err){
                $scope.resetAlert("danger", "Eroare la stergerea fisierului asociat");
            }else{
                //now remove collection
                $scope.resetAlert("warning", "Se sterge din baza de date...");
                SpecialProductsService.resources.delete({id: item._id}).$promise.then(function () {
                    $scope.resetAlert();
                    refreshTable();
                }).catch(function (resp) {
                    $scope.resetAlert("danger", Error.getMessage(resp).message);
                });
            }
        })
    };

}]);