/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('productsCtrl', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','ngTableParams','$filter', function($scope,$rootScope,ProductService,$stateParams,$sce,ngTableParams,$filter){
    ProductService.getAll.query().$promise.then(function(result){
        var products = result['productList'];
        console.log(result);
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
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);
