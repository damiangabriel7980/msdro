controllers.controller('PublicCategories', ['$scope', '$rootScope', '$state', '$filter', 'ngTableParams', '$modal', 'ActionModal', 'publicContentService', 'Success', 'Error', function($scope, $rootScope, $state, $filter, ngTableParams, $modal, ActionModal, publicContentService, Success, Error){

    $scope.refreshTable = function () {
        publicContentService.categories.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);

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
                total: data.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());
                    $scope.resultData = orderedData;
                    params.total(orderedData.length);
                    if(params.total() < (params.page() -1) * params.count()){
                        params.page(1);
                    }
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

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

    $scope.addCategory = function(){
        publicContentService.categories.create({}).$promise.then(function (resp) {
            $scope.refreshTable();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.deleteCategory = function (id) {
        console.log(id);
        ActionModal.show("Stergere categorie", "Sunteti sigur ca doriti sa stergeti categoria?", function () {
            publicContentService.categories.delete({id: id}).$promise.then(function (resp) {
                console.log(resp);
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.toogleCategoryEnabled = function (id, isEnabled) {
        ActionModal.show(
            isEnabled?"Dezactiveaza categorie":"Activeaza categorie",
            isEnabled?"Sunteti sigur ca doriti sa dezactivati categoria?":"Sunteti sigur ca doriti sa activati categoria?",
            function () {
                publicContentService.categories.update({id: id}, {isEnabled: !isEnabled}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.reload();
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            },{
                yes: "Da"
            }
        );
    };

    $scope.editCategory = function (category) {
        $modal.open({
            templateUrl: 'partials/admin/content/publicContent/categories/modalEditCategory.html',
            windowClass: 'fade',
            size: 'lg',
            controller: 'EditPublicContentCategory',
            resolve: {
                category: function () {
                    return JSON.parse(JSON.stringify(category));
                }
            }
        });
    };
}]);