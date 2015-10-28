/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guideLineFileController',['$scope','GuideLineService','Success','ActionModal','$state','ngTableParams','$filter','$modal','AmazonService',function($scope,GuideLineService,Success,ActionModal,$state,ngTableParams,$filter,$modal,AmazonService){
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
    console.log($scope);
    var deleteFromAmazon = function(path){
        var filePath = replace(path,AmazonService.getBucketUrl(),'')
        AmazonService.deleteFile(filePath, function (err, success) {
            if(err){
                resetS3Alert("danger", "Eroare la stergerea fisierului");
            }else{
                resetS3Alert();
                scope.keys.splice(id,1);
                scope.$apply();
            }
        })
    };

    $scope.removeFile = function (file){
        console.log(file);
        ActionModal.show("Stergere fisier", "Sunteti sigur ca doriti sa stergeti fisierul?", function () {
         //   deleteFromAmazon(file.guidelineFileUrl);
            GuideLineService.file.delete({id: file._id}).$promise.then(function () {
                $state.reload();
            });
        },{
            yes: "Sterge"
        });
    };
}]);