controllers.controller('IntroToggle', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','idToEdit','$modalInstance','AmazonService','$timeout','status', 'Success', 'Error', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,idToEdit,$modalInstance,AmazonService,$timeout,status,Success,Error){


    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.toggleIntro=function(){
                IntroService.intros.update({id: idToEdit},{isEnabled: !status}).$promise.then(function(resp){
                        $scope.actionCompleted = true;
                        $scope.statusAlert.newAlert=true;
                        $scope.statusAlert.type="success";
                        $scope.statusAlert.message = Success.getMessage(resp);
                        $timeout(function(){
                            $modalInstance.close();
                            $state.reload();
                        },3000);
                }).catch(function(err){
                    $scope.statusAlert.type = "danger";
                    $scope.statusAlert.message = Error.getMessage(err.data);
                    $scope.statusAlert.newAlert = true;
                });

    };
    $scope.closeModal=function(){
        $modalInstance.close();
        $state.reload();
    }
}]);