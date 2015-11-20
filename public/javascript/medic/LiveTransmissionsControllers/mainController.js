app.controllerProvider.register('ConferenceListController',['$scope','$state','ConferenceService','Success','$modal',function($scope,$state,ConferenceService,Success,$modal){


  console.log('asdasdasd');
  var onInit = function(){
    ConferenceService.conference.query().$promise.then(function(resp){
      $scope.conferences = Success.getObject(resp);
      console.log($scope.conferences);
    }).catch(function(err){
      console.log(err);
    })
  };

  onInit();
  $scope.openPreview = function(conference){
    var modalInstance = $modal.open({
      animation:true,
        backdrop:'static',
      keyboard:false,
      templateUrl:'partials/medic/modals/previewModal.ejs',
      controller:'previewModalController',
      size:'lg',
      resolve:{
        conference:function(){
          return conference
        }
      }
    })
  }

}]);
