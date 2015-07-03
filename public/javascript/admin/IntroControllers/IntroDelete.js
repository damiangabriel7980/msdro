controllers.controller('IntroDelete', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','idToEdit','$modalInstance','AmazonService','$timeout', 'Success', 'Error', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,idToEdit,$modalInstance,AmazonService,$timeout,Success,Error){


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
                        $scope.actionCompleted = true;
                        $scope.statusAlert.newAlert=true;
                        $scope.statusAlert.type="success";
                        $scope.statusAlert.message = Success.getMessage(resp);
                        $timeout(function(){
                            $modalInstance.close();
                            $state.reload();
                        },5000);
                }).catch(function(err){
                    $scope.statusAlert.type = "danger";
                    $scope.statusAlert.message = Error.getMessage(err.data);
                    $scope.statusAlert.newAlert = true;
                });
            }
        });

    };
    $scope.closeModal=function(){
        $modalInstance.close();
        $state.reload();
    }
}]);