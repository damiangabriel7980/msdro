/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guidelineFileModal',['$scope','idToEdit','$modalInstance','GuideLineService','Success','$timeout','$state',function($scope,idToEdit,$modalInstance,GuideLineService,Success,$timeout,$state){

    $scope.idToEdit = idToEdit;
    $scope.guidelineFileBody = null;

    $scope.resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text
        }
    };
    console.log($scope);
    $scope.$on('fileUpdated',function(event,updateFileInfo){
        $scope.file.guidelineFileUrl = $scope.bucketUrl + updateFileInfo;
        $scope.file.displayName = $scope.file.actualName = updateFileInfo.split('/').pop();
    })

   var onInit = function(){

   GuideLineService.category.query().$promise.then(function(resp){
       $scope.categories = Success.getObject(resp);
   }).catch(function(err){
       console.log(err)
   });


   GuideLineService.file.query({id:$scope.idToEdit}).$promise.then(function(resp){
        $scope.file = Success.getObject(resp);
    }).catch(function(err){

    });

   };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    $scope.save = function(file){
        var fileIdToEdit = file._id;

        delete file['_id'];
        GuideLineService.file.update({id:fileIdToEdit},file).$promise.then(function(resp) {
            $state.reload();
            $scope.closeModal();
        }).catch(function(err){

        })
    };

    onInit();


}]);