controllers.controller('ProductPage', ['$scope', '$rootScope', '$stateParams','$filter', 'ngTableParams' ,'SpecialProductsService', '$modal', 'Success', function($scope, $rootScope, $stateParams, $filter, ngTableParams, SpecialProductsService, $modal, Success){

    $scope.refreshTable = function () {
        SpecialProductsService.products.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    product_name: 'asc'     // initial sorting
                },
                filter: {
                    product_name: ''       // initial filter
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

    SpecialProductsService.groups.query().$promise.then(function (resp) {
        $scope.groups = Success.getObject(resp);
    });

    $scope.refreshTable();

    $scope.addSpecialProduct = function(){
        $modal.open({
            templateUrl: 'partials/admin/content/specialProducts/baseModalView.html',
            windowTemplateUrl: 'partials/admin/content/specialProducts/modalTemplate.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'ProductPageModal',
            resolve: {
                intent: function () {
                    return "specialProductAdd"
                },
                sessionData: function () {
                    return "test";
                }
            }
        });
    };

    $scope.editSpecialProduct = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/specialProducts/baseModalView.html',
            windowTemplateUrl: 'partials/admin/content/specialProducts/modalTemplate.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'ProductPageModal',
            resolve: {
                intent: function () {
                    return "specialProductEdit"
                },
                sessionData: function () {
                    return {idToEdit: id};
                }
            }
        });
    };

    $scope.deleteSpecialProduct = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/specialProducts/toggleOrDelete.html',
            size: 'md',
            windowClass: 'fade',
            controller: 'DeleteProductPage',
            resolve: {
                idToDelete: function () {
                    return id;
                }
            }
        });
    };

    $scope.toggleSpecialProduct = function (id, enabled) {
        $modal.open({
            templateUrl: 'partials/admin/content/specialProducts/toggleOrDelete.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'EnableProductPage',
            resolve: {
                idToToggle: function () {
                    return id;
                },
                isEnabled: function () {
                    return enabled;
                }
            }
        });
    }

}]);