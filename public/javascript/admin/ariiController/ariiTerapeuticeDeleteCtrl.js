/**
 * Created by miricaandrei23 on 04.02.2015.
 */
cloudAdminControllers.controller('ariiTerapeuticeDeleteCtrl', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state){
    $scope.deleteArea = function(){
        areasAdminService.deleteOrUpdateareas.delete({id:$stateParams.id}).$promise.then(function(result){
            $scope.statusAlert.newAlert=true;
            $scope.statusAlert.message = result.message;
        });
        $state.go('ariiTerapeutice',{},{reload: true});
        $modalInstance.close();
    };
    $scope.closeModal=function(){
        $state.go('ariiTerapeutice',{},{reload: true});
        $modalInstance.close();
    }

}]);
