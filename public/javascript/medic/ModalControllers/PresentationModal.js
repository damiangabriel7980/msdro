controllers.controller('PresentationModal', ['$scope', '$rootScope', 'PresentationService', '$sce', '$modal','$timeout','$state','$modalInstance', function($scope, $rootScope, PresentationService, $sce, $modal,$timeout,$state,$modalInstance) {
    PresentationService.getUserHomeModal.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
       $scope.presentation=resp;
    });

    $scope.trustAsHtml=function(content){
      return $sce.trustAsHtml(content);
    };

    $scope.changeStatus=function(){
        console.log(this.rememberOption);
        changeLocalGroupModalStatus($rootScope.specialGroupSelected._id,this.rememberOption);

    };
    var changeLocalGroupModalStatus= function(groupID,value){
        var retrievedObject = localStorage.getItem('statusModalGroups');
        var statusModals = JSON.parse(retrievedObject);
        statusModals[groupID] = value;
        localStorage.setItem('statusModalGroups',JSON.stringify(statusModals));
    };
    $scope.closeModal=function(){
      $modalInstance.close();
    };

}]);
