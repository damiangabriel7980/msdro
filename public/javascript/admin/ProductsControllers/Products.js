/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('Products', ['$scope', '$state', 'ProductService','$sce','ngTableParams','$filter', '$modal', 'ActionModal','$q','Success','Error', function($scope, $state, ProductService,$sce,ngTableParams,$filter,$modal,ActionModal,$q,Success,Error){

    function refreshTable() {
        ProductService.products.query().$promise.then(function(result){
            var products = Success.getObject(result);
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    last_updated: 'desc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            }, {
                total: products.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(products, params.filter())), params.orderBy());
                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
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
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    }

    refreshTable();

    $scope.addProduct = function () {
        ProductService.products.create({}).$promise.then(function (resp) {
            refreshTable();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
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
            ProductService.products.delete({id: id}).$promise.then(function(result){
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);
