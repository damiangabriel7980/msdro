/**
 * Created by user on 02.10.2015.
 */
controllers.controller('AppUpdateController',['$scope','ApplicationService','Success','ActionModal','$state','ngTableParams','$filter','$modal',function($scope,ApplicationService,Success,ActionModal,$state,ngTableParams,$filter,$modal){



    var refreshApps = function (){
        ApplicationService.app.query().$promise.then(function(resp){
            var apps = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    upgradeDate: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: apps.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(apps, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

    };
    refreshApps();


    $scope.addApp = function(){
        ApplicationService.app.create({}).$promise.then(function(){
            refreshApps();
        })
    };

    $scope.editApp = function(id){
            $modal.open({
                templateUrl: 'partials/admin/applications/appUpdate/modalAppUpdate.html',
                windowClass: 'fade',
                controller: 'AppUpdateEdit',
                resolve: {
                    idToEdit: function () {
                        return id;
                    }
                }
            });
        };

    $scope.removeApp = function (id){
        ActionModal.show("Stergere informatii despre aplicatie", "Sunteti sigur ca doriti sa stergeti informatiile despre aplicatie?", function () {
            ApplicationService.app.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        },{
            yes: "Sterge"
        });
    };
}]);