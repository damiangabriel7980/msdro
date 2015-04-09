controllers.controller('PublicCategories', ['$scope', '$rootScope', '$state', '$filter', 'ngTableParams', '$modal', 'ActionModal', 'publicContentService', function($scope, $rootScope, $state, $filter, ngTableParams, $modal, ActionModal, publicContentService){

    $scope.refreshTable = function () {
        publicContentService.categories.query().$promise.then(function (resp) {
            var data = resp.success;

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
                total: data.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };

    $scope.refreshTable();

    $scope.addCategory = function(){
        $modal.open({
            templateUrl: 'partials/admin/content/publicContent/categories/modalAddCategory.html',
            windowClass: 'fade',
            controller: 'AddPublicContentCategory'
        });
    };

    $scope.deleteCategory = function (id) {
        console.log(id);
        ActionModal.show("Stergere categorie", "Sunteti sigur ca doriti sa stergeti categoria?", function () {
            publicContentService.categories.delete({id: id}).$promise.then(function (resp) {
                console.log(resp);
                $state.reload();
            });
        }, "Sterge");
    };

    $scope.toogleCategoryEnabled = function (id, isEnabled) {
        ActionModal.show(
            isEnabled?"Dezactiveaza categorie":"Activeaza categorie",
            isEnabled?"Sunteti sigur ca doriti sa dezactivati categoria?":"Sunteti sigur ca doriti sa activati categoria?",
            function () {
                publicContentService.categories.update({id: id}, {isEnabled: !isEnabled}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.reload();
                });
            },
            "Da"
        );
    };

    $scope.editCategory = function (category) {
        $modal.open({
            templateUrl: 'partials/admin/content/publicContent/categories/modalEditCategory.html',
            windowClass: 'fade',
            controller: 'EditPublicContentCategory',
            resolve: {
                category: function () {
                    return JSON.parse(JSON.stringify(category));
                }
            }
        });
    };
}]);