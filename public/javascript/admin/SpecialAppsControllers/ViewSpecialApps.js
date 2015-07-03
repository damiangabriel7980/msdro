controllers.controller('ViewSpecialApps', ['$scope', '$rootScope', '$state', '$stateParams','$filter', 'ngTableParams' ,'SpecialAppsService', '$modal', 'ActionModal', 'InfoModal', 'Success', 'Error', function($scope, $rootScope, $state, $stateParams, $filter, ngTableParams, SpecialAppsService, $modal, ActionModal, InfoModal,Success,Error){

    var refreshTable = function () {
        SpecialAppsService.apps.query().$promise.then(function (resp) {
            var data = Success.getObject(resp);

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
        }).catch(function(err){
            console.log(Error.getMessage(err.data));
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
                    refreshTable();
            }).catch(function(err){
                InfoModal.show("Eroare", "Eroare la stergerea aplicatiei");
            });
        }, "Da");
    };

    $scope.toggleSpecialApp = function (app) {
        ActionModal.show(
            app.isEnabled?"Dezactiveaza aplicatie":"Activeaza aplicatie",
            app.isEnabled?"Sunteti sigur ca doriti sa dezactivati aplicatia?":"Sunteti sigur ca doriti sa activati aplicatia?",
            function () {
                SpecialAppsService.apps.update({id: app._id}, {isEnabled: !app.isEnabled}).$promise.then(function (resp) {
                        refreshTable();
                }).catch(function(err){
                    InfoModal.show("Eroare", Error.getMessage(err.data));
                });
            },
            "Da"
        );
    }

}]);