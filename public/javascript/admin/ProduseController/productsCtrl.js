/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('productsCtrl', ['$scope' ,'ProductService','$sce','ngTableParams','$filter', '$modal', function($scope,ProductService,$sce,ngTableParams,$filter,$modal){
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
    });

    $scope.addProduct = function () {
        $modal.open({
            templateUrl: 'partials/admin/continut/productsAdd.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"productsAddCtrl"
        })
    };

    $scope.editProduct = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/continut/productsEdit.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"productsEditCtrl",
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);
