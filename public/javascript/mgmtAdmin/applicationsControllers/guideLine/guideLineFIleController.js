/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guideLineFileController',['$scope','GuideLineService','Success','ActionModal','$state','ngTableParams','$filter','$modal','AmazonService','InfoModal',function($scope,GuideLineService,Success,ActionModal,$state,ngTableParams,$filter,$modal,AmazonService,InfoModal){
    var refreshFiles = function (){
        GuideLineService.file.query().$promise.then(function(resp){
            var files = Success.getObject(resp);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    creationDate: 'desc'     // initial sorting
                }
            };
            $scope.tableParams = new ngTableParams(params, {
                total: files.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(files, params.filter())), params.orderBy());
                    $scope.resultData = orderedData;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

    };
    refreshFiles();

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

    var resetS3Alert = function (type, text) {
        $scope.s3Alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text?text:"Unknown error"
        }
    };


    $scope.addFile = function(){
        GuideLineService.file.create().$promise.then(function(resp){
            $state.reload();
        })
    };

    $scope.disableFile = function(id,file){
        ActionModal.show(file.enabled?"Dezactiveaza fisierul":"Activeaza fisierul",
            file.enabled?"Sunteti sigur ca doriti sa dezactivati fisierul?":"Sunteti sigur ca doriti sa activati fisierul?",function(){
            if(file.guidelineFileUrl){
              var toEdit = file;
              toEdit.enabled = !toEdit.enabled;
              delete toEdit['_id'];
              GuideLineService.file.update({fileId:id,displayName:toEdit.displayName},toEdit).$promise.then(function(resp){
                  $state.reload();
              }).catch(function(err){

              })
            }  else{
              InfoModal.show("Elementul selectat nu are nici un fisier atasat");
            }

        },{
            yes:'Da'
        });
    };

    $scope.editFile = function(id){
        $modal.open({
            templateUrl: 'partials/admin/applications/guideLines/guidelineFileModal.html',
            windowClass: 'fade stretch',
            controller: 'guidelineFileModal',
            backdrop:'static',
            size:'lg',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };


    var deleteFromDatabase = function(id){
      GuideLineService.file.delete({id:id}).$promise.then(function(resp){
              $state.reload();
      }).catch(function(err){
          InfoModal.show("Eroare la stergerea fisierului");
      });
    };

    $scope.removeFile = function (file){
        ActionModal.show("Stergere fisier", "Sunteti sigur ca doriti sa stergeti fisierul?", function () {
          resetS3Alert("danger","Se sterge fisierul...");
          if(file.guidelineFileUrl){
            AmazonService.deleteFile((file.guidelineFileUrl.substring(AmazonService.getBucketUrl().length).replace(/%20/g,' ')),function(err,success){
              if(err){
                ActionModal.show("Eroare la stergerea fisierului");
              }
              else{
                  deleteFromDatabase(file._id);
              }
            })
          }else{
            deleteFromDatabase(file._id);
          }
        },{
            yes: "Sterge"
        });
    };
}]);
