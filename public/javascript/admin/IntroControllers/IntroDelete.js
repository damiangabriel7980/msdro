controllers.controller('IntroDelete', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','idToEdit','$modalInstance','AmazonService','$timeout', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,idToEdit,$modalInstance,AmazonService,$timeout){


    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.deleteIntro=function(){
        $scope.statusAlert.newAlert=true;
        $scope.statusAlert.type="warning";
        $scope.statusAlert.message="Se sterge prezentarea ...";
        AmazonService.deleteFilesAtPath("presentations/"+idToEdit+'/resources/', function (err, imageDeleteCount) {
            if(err){
                $scope.statusAlert.newAlert=true;
                $scope.statusAlert.type="danger";
                $scope.statusAlert.message="Eroare la stergerea de pe Amazon!";
            }else{
                //delete product and every menu items attached to it
                IntroService.intros.delete({idToDelete: idToEdit}).$promise.then(function(resp){
                    if(resp.error){
                        $scope.statusAlert.newAlert=true;
                        $scope.statusAlert.type="danger";
                        $scope.statusAlert.message=imageDeleteCount.message;
                    }else{
                        $scope.actionCompleted = true;
                        $scope.statusAlert.newAlert=true;
                        $scope.statusAlert.type="success";
                        $scope.statusAlert.message=resp.message;
                        $timeout(function(){
                            $modalInstance.close();
                            $state.reload();
                        },5000);
                    }

                });
            }
        });

    };
    $scope.closeModal=function(){
        $modalInstance.close();
        $state.reload();
    }
}]);