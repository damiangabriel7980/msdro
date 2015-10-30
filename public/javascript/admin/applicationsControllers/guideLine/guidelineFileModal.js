/**
 * Created by user on 26.10.2015.
 */
controllers.controller('guidelineFileModal',['$scope','idToEdit','$modalInstance','GuideLineService','Success','$timeout','$state','$rootScope',function($scope,idToEdit,$modalInstance,GuideLineService,Success,$timeout,$state,$rootScope){

    $scope.idToEdit = idToEdit;
    $scope.guidelineFileBody = null;
    $scope.showErr = false;

    $scope.resetAlert = function (type, text) {
        $scope.alert = {
            type: type?type:"danger",
            show: text?true:false,
            text: text
        }
    };


    $scope.$on('fileUpdated',function(event,updateFileInfo){
        $scope.file.guidelineFileUrl = $rootScope.pathAmazonDev + updateFileInfo;
        $scope.file.actualName = updateFileInfo.split('/').pop();
        $scope.file.displayName = $scope.file.actualName.split('.',1)
    });

    $scope.$on('fileDeleted',function(event){
        $scope.file.guidelineFileUrl = '';
        $scope.file.displayName= $scope.file.actualName = 'Untitled';
    });

   var onInit = function(){

   GuideLineService.category.query().$promise.then(function(resp){
       $scope.categories = Success.getObject(resp);
   }).catch(function(err){
       console.log(err);
   });


   GuideLineService.file.query({id:$scope.idToEdit}).$promise.then(function(resp){
        $scope.file = Success.getObject(resp);
       $scope.selectedCategory = $scope.file.guidelineCategoryName;
    }).catch(function(err){

    });

   };

    $scope.closeModal = function () {
        $modalInstance.close();
    };

    var prepareFile = function(file){

        file.lastModified = new Date();
        file.guidelineCategoryName = $scope.selectedCategory.name;
        file.guidelineCategoryId = $scope.selectedCategory._id;
        delete file['_id'];
        return file;
    };

    $scope.save = function(file){
        var fileIdToEdit = file._id;
        var fileToEdit = prepareFile(file);

        GuideLineService.file.update({id:fileIdToEdit,displayName:file.displayName,guidelineCategoryId:file.guidelineCategoryId},fileToEdit).$promise.then(function(resp) {
            $state.reload();
            $modalInstance.close();
        }).catch(function(err){
            console.log(err);
            $scope.showErr = true;
        })
    };

    onInit();


}]);