/**
 * Created by user on 02.10.2015.
 */
controllers.controller('AppUpdateEdit',['$scope','$modalInstance','idToEdit','ApplicationService','Success','$state',function($scope,$modalInstance , idToEdit ,ApplicationService,Success,$state){
    $scope.toManyApps = false ;

    $scope.app = {};
   var initialize= function(){
       ApplicationService.app.query({id:idToEdit}).$promise.then(function(resp){
       var app = Success.getObject(resp);
       $scope.app = app;
       $scope.currentAppVersion = app.version;
       if(app.upgradeDate){
           $scope.upDate = app.upgradeDate;
       }
       else{
           $scope.upDate = new Date();
       }
           $scope.$applyAsync();
       });
   };

    initialize();

    $scope.save = function (app){
        var toUpdate = {};
        toUpdate.downloadUrl = app.downloadUrl;
        toUpdate.name = app.name.toLowerCase();
        toUpdate.upgradeDate = new Date();
        toUpdate.version = $scope.app.version;
          ApplicationService.app.update({downloadUrl:app.downloadUrl,name:app.name,id:app._id},toUpdate).$promise.then(function(resp){
              $state.reload();
              $modalInstance.close();
          }).catch(function(err){
                $scope.toManyApps = true;
          })
    };
    $scope.closeModal = function () {
        $modalInstance.close();
    };
}])