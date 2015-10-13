/**
 * Created by user on 02.10.2015.
 */
controllers.controller('AppUpdateEdit',['$scope','$modalInstance','appToEdit','ApplicationService','Success','$state',function($scope,$modalInstance , appToEdit ,ApplicationService,Success,$state){
    $scope.minDate = new Date();



    //ApplicationService.app.query({id:idToEdit}).$promise.then(function(resp){
    //    var app = Success.getObject(resp);
    //    $scope.app = app;
    //    if(app.upgradeDate){
    //        $scope.upDate = app.upgradeDate;
    //    }
    //    else{
    //        $scope.upDate = new Date();
    //    }
    //});

   var initialize= function(){ $scope.app = appToEdit;

    if ($scope.app.upgradeDate){
        $scope.upDate = $scope.app.upgradeDate
    }
    else{
        $scope.upDate = new Date();
    }
   }

    initialize();

    $scope.save = function (app){
        var toUpdate = {};
        toUpdate.downloadUrl = app.downloadUrl;
        toUpdate.name = app.name.toLowerCase();
        toUpdate.upgradeDate = $scope.upDate;
        toUpdate.version = $scope.app.version;
      ApplicationService.app.update({id:app._id},toUpdate).$promise.then(function(resp){
          $state.reload();
          $modalInstance.close();
      })
    };
    $scope.closeModal = function () {
        $modalInstance.close();
    };
}])