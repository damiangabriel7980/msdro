controllers.controller('ProductPage', ['$scope', '$rootScope', '$stateParams','$filter', 'ngTableParams' ,'SpecialProductsService', '$modal', 'Success', 'Error', 'advancedNgTableFilter', function($scope, $rootScope, $stateParams, $filter, ngTableParams, SpecialProductsService, $modal, Success, Error, advancedNgTableFilter){

    $scope.refreshTable = function () {
        SpecialProductsService.products.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);

            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    product_name: 'asc'     // initial sorting
                }
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {

                    var filterObject = advancedNgTableFilter.filterByNestedObject(params.$params.filter);

                    // filter with $filter (don't forget to inject it)
                    var filteredDatas = params.filter() ? $filter('filter')(data, filterObject) : data;

                    // ordering
                    var key = params.sorting() ? Object.keys(params.sorting())[0] : null;
                    var orderedDatas = params.sorting() ? $filter('orderBy')(filteredDatas, key, params.sorting()[key] == 'desc') : filteredDatas;

                    // get for the wanted subset
                    var splitedDatas = orderedDatas.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    // resolve the ngTable promise
                    $scope.resultData = splitedDatas;
                    params.total(splitedDatas.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(splitedDatas.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };

    SpecialProductsService.groups.query().$promise.then(function (resp) {
        $scope.groups = Success.getObject(resp);
    });

    $scope.refreshTable();

    $scope.selectedItems = new Set();

    $scope.addToSelectedItems = function(id){
        if($scope.selectedItems.has(id)){
            $scope.selectedItems.delete(id)
        } else {
            $scope.selectedItems.add(id);
        }
    };
    $scope.checkValue = function(id){
        if($scope.selectedItems.has(id)) {
            return true;
        } else {
            return false;
        }
    };
    $scope.addSpecialProduct = function(){
        SpecialProductsService.products.create({}).$promise.then(function (resp) {
            $scope.refreshTable();
        }).catch(function (err) {
            console.log(Error.getMessage(err));
        });
    };

    $scope.editSpecialProduct = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/specialProducts/baseModalView.html',
            size: 'lg',
            windowClass: 'fade stretch',
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