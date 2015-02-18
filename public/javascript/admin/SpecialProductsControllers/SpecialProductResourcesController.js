cloudAdminControllers.controller('SpecialProductResourcesController', ['$scope', 'SpecialProductsService', 'ngTableParams', '$filter', 'AmazonService', function($scope, SpecialProductsService, ngTableParams, $filter, AmazonService) {

    //console.log($scope.sessionData);
    //$scope.resetAlert("success", "works");

    var refreshTable = function () {
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
                SpecialProductsService.resources.delete({id: item._id}).$promise.then(function (resp) {
                    if(resp.error){
                        $scope.resetAlert("danger", resp.message);
                    }else{
                        $scope.resetAlert();
                        refreshTable();
                    }
                });
            }
        })
    };

}]);