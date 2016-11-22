/**
 * Created by user on 02.10.2015.
 */
controllers.controller('AppUpdateController',['$scope','ApplicationService','Success','ActionModal','$state','ngTableParams','$filter','$modal', 'Utils', 'exportCSV', function($scope,ApplicationService,Success,ActionModal,$state,ngTableParams,$filter,$modal, Utils, exportCSV){

    $scope.csv = {
        filename: "MSD_Apps_" + Utils.customDateFormat(new Date(), {separator:'-'}) + '.csv',
        rows: []
    };

    $scope.getHeader = function () {
        return ['Name', 'Data actualizarii','URL', 'Versiune']
    };

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
            $scope.csv.rows = exportCSV.formatArrayCSV(apps, ['name', 'upgradeDate', 'downloadUrl', 'version']);
            $scope.tableParams = new ngTableParams(params, {
                total: apps.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(apps, params.filter())), params.orderBy());

                    $scope.resultData = orderedData;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

    };
    refreshApps();


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