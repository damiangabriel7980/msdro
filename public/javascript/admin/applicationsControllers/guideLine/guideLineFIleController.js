/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guideLineFileController',['$scope','GuideLineService','Success','ActionModal','$state','ngTableParams','$filter','$modal',function($scope,GuideLineService,Success,ActionModal,$state,ngTableParams,$filter,$modal){
    var refreshFiles = function (){
        GuideLineService.file.query().$promise.then(function(resp){
            console.log(resp);
            var files = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    date_created: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: files.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(files, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

    };
    refreshFiles();
    console.log('test');

    $scope.addFile = function(){
        console.log('asdasd');
        GuideLineService.file.create({}).$promise.then(function(){
            refreshFiles();
        })
    };

    $scope.editFile = function(id){
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

    $scope.removeFile = function (id){
        ActionModal.show("Stergere fisier", "Sunteti sigur ca doriti sa stergeti fisierul?", function () {
            GuideLineService.file.delete({id: id}).$promise.then(function () {
                $state.reload();
            });
        },{
            yes: "Sterge"
        });
    };
}]);