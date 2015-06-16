controllers.controller('PresentationModal', ['$scope', '$rootScope', 'PresentationService', '$sce', '$modal','$timeout','$state','$modalInstance','alterIntroService', function($scope, $rootScope, PresentationService, $sce, $modal,$timeout,$state,$modalInstance,alterIntroService) {
    PresentationService.getUserHomeModal.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
       $scope.presentation=resp;
    });

    $scope.changeStatus=function(){
        if($rootScope.specialGroupSelected===null)
            changeLocalGroupModalStatus($scope.presentation.groupsID[0],this.rememberOption);
        else
            changeLocalGroupModalStatus($rootScope.specialGroupSelected._id,this.rememberOption);

    };
    var changeLocalGroupModalStatus= function(groupID,value){
        var retrievedObject = localStorage.getItem('statusModalGroups');
        var statusModals = JSON.parse(retrievedObject);
        statusModals[groupID] = value;
        localStorage.setItem('statusModalGroups',JSON.stringify(statusModals));
    };
    $scope.closeModal=function(){
        if($rootScope.specialGroupSelected===null)
        {
            alterIntroService.alterIntro.save({groupID: $scope.presentation.groupsID[0]}).$promise.then(function(alteredSession){
                $modalInstance.close();
            });
        }
        else
        {
            alterIntroService.alterIntro.save({groupID: $rootScope.specialGroupSelected._id}).$promise.then(function(alteredSession){
                $modalInstance.close();
            });
        }


    };

}]);
