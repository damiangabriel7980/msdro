/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guideLineFileController',['$scope','GuideLineService','Success','ActionModal','$state','ngTableParams','$filter','$modal',function($scope,GuideLineService,Success,ActionModal,$state,ngTableParams,$filter,$modal){
    var refreshFiles = function (){
        GuideLineService.file.query().$promise.then(function(resp){
            var files = Success.getObject(resp);
            console.log(files);
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

    $scope.resourceFileBody = null;



    $scope.addFile = function(){
        GuideLineService.file.create().$promise.then(function(resp){
            refreshFiles();
        })
    };

    $scope.disableFile = function(id,file){
        var toEdit = file;
        toEdit.enabled = !toEdit.enabled;
        delete toEdit['_id'];
        GuideLineService.file.update({id:id},toEdit).$promise.then(function(resp){
            refreshFiles();
        }).catch(function(err){

        })
    }

    $scope.editFile = function(id){
        $modal.open({
            templateUrl: 'partials/admin/applications/guideLines/guidelineFileModal.html',
            windowClass: 'fade',
            controller: 'guidelineFileModal',
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