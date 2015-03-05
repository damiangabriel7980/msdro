controllers.controller('ViewSpecialApps', ['$scope', '$rootScope', '$state', '$stateParams','$filter', 'ngTableParams' ,'SpecialAppsService', '$modal', 'ActionModal', 'InfoModal', function($scope, $rootScope, $state, $stateParams, $filter, ngTableParams, SpecialAppsService, $modal, ActionModal, InfoModal){

    var refreshTable = function () {
        SpecialAppsService.apps.query().$promise.then(function (resp) {
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

    refreshTable();

    $scope.addSpecialApp = function(){
        $modal.open({
            templateUrl: 'partials/admin/content/specialApps/modalEditSpecialApp.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddSpecialApp'
        });
    };

    $scope.editSpecialApp = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/specialApps/modalEditSpecialApp.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditSpecialApp',
            resolve:{
                idToEdit: function () {
                    return id;
                }
            }
        });
    };

    $scope.deleteSpecialApp = function (id) {
        ActionModal.show("Stergere aplicatie", "Sunteti sigur ca doriti sa stergeti aplicatia?", function () {
            SpecialAppsService.apps.delete({id: id}).$promise.then(function (resp) {
                if(resp.error){
                    InfoModal.show("Eroare", "Eroare la stergerea aplicatiei");
                }else{
                    refreshTable();
                }
            });
        }, "Da");
    };

    $scope.toggleSpecialProduct = function (id, enabled) {
        //toggle app
    }

}]);