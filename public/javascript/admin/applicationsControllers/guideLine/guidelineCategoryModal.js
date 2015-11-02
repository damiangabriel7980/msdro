/**
 * Created by user on 28.10.2015.
 */
controllers.controller('guidelineCategoryModal',['$scope','GuideLineService','idToEdit','Success','$modalInstance','$state','$rootScope',function($scope,GuideLineService,idToEdit,Success,$modalInstance,$state,$rootScope){
        $scope.toEdit = idToEdit;

        var onInit = function(){
            GuideLineService.category.query({id:$scope.toEdit}).$promise.then(function(resp){
                $scope.category = Success.getObject(resp);
            })
        };

    onInit();

    $scope.showErr=false;

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.$on('fileUpdated',function(event,imgUrl){
        $scope.category.imageUrl =$rootScope.pathAmazonDev+ imgUrl;
        $scope.category.imageUrl = $scope.category.imageUrl.replace(/\s/g, '');
    });

    $scope.$on('fileDeleted',function(event){
        $scope.category.imageUrl='';
    });

    $scope.save=function(category){
      var categoryToEdit = category._id;
        category.lastModified = new Date();
        delete category['_id'];
        GuideLineService.category.update({id:categoryToEdit,name:category.name},category).$promise.then(function(resp){
            $state.reload();
            $modalInstance.close();
        }).catch(function(err){
            $scope.showErr = true;
            console.log(err);
        });

    };
}]);