/**
 * Created by user on 02.10.2015.
 */
controllers.controller('AppUpdateEdit',['$scope','$modalInstance','idToEdit','ApplicationService','Success','$state',function($scope,$modalInstance , idToEdit ,ApplicationService,Success,$state){
    $scope.minDate = new Date();

    ApplicationService.app.query({id:idToEdit}).$promise.then(function(resp){
        var app = Success.getObject(resp);
        $scope.app = app;
        if(app.upDate){
            $scope.upDate = app.upDate;
        }
        else{
            $scope.upDate = new Date();
        }
    });

    $scope.save = function (app){
        var toUpdate = {};
        toUpdate.downloadUrl = app.downloadUrl;
        toUpdate.name = app.name.toLowerCase();
        toUpdate.upDate = $scope.upDate;
      ApplicationService.app.update({id:app._id},toUpdate).$promise.then(function(resp){
          $state.reload();
          $modalInstance.close();
      })
    };
    $scope.closeModal = function () {
        $modalInstance.close();
    };
}])