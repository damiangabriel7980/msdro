controllers.controller('IntroToggle', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','idToEdit','$modalInstance','AmazonService','$timeout','status', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,idToEdit,$modalInstance,AmazonService,$timeout,status){


    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.toggleIntro=function(){
        console.log(!status);
                IntroService.toggleIntro.save({id: idToEdit,isEnabled: !status}).$promise.then(function(resp){
                    if(resp.error){
                        $scope.statusAlert.newAlert=true;
                        $scope.statusAlert.type="danger";
                        $scope.statusAlert.message="Nu s-a putut modifica status-ul";
                    }else{
                        $scope.actionCompleted = true;
                        $scope.statusAlert.newAlert=true;
                        $scope.statusAlert.type="success";
                        $scope.statusAlert.message=resp.message;
                        $timeout(function(){
                            $modalInstance.close();
                            $state.reload();
                        },3000);
                    }
                });

    };
    $scope.closeModal=function(){
        $modalInstance.close();
        $state.reload();
    }
}]);