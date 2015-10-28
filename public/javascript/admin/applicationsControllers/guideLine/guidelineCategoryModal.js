/**
 * Created by user on 28.10.2015.
 */
controllers.controller('guidelineCategoryModal',['$scope','GuideLineService','idToEdit','Success','$modalInstance','$state',function($scope,GuideLineService,idToEdit,Success,$modalInstance,$state){
        $scope.toEdit = idToEdit;

        var onInit = function(){
            GuideLineService.category.query({id:$scope.toEdit}).$promise.then(function(resp){
                $scope.category = Success.getObject(resp);
            })
        };

    onInit();

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.save=function(category){
      var categoryToEdit = category._id;
        category.lastModified = new Date();
        delete category['_id'];
        GuideLineService.category.update({id:categoryToEdit},category).$promise.then(function(resp){
            $state.reload();
            $modalInstance.close();
        })

    };
}]);