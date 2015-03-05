/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('Products', ['$scope', '$state', 'ProductService','$sce','ngTableParams','$filter', '$modal', 'ActionModal','$q', function($scope, $state, ProductService,$sce,ngTableParams,$filter,$modal,ActionModal,$q){
    ProductService.getAll.query().$promise.then(function(result){
        var products = result['productList'];
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
            total: products.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(products, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        $scope.theraptableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                name: 'asc'     // initial sorting
            },
            filter: {
                name: ''       // initial filter
            }
        }, {
            total: products.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(products, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.addProduct = function () {
        $modal.open({
            templateUrl: 'partials/admin/content/products/productsAdd.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"AddProduct"
        })
    };

    $scope.editProduct = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/products/productsEdit.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"EditProduct",
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    };
    $scope.deleteProduct = function (id) {
        ActionModal.show("Stergere produs", "Sunteti sigur ca doriti sa stergeti acest produs?", function () {
            ProductService.deleteOrUpdateProduct.delete({id: id}).$promise.then(function(result){
                console.log(result);
                $state.reload();
            });
        }, "Sterge");
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);