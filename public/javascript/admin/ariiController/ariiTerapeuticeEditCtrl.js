/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('ariiTerapeuticeEditCtrl', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state){

    $scope.arie = areasAdminService.deleteOrUpdateareas.getArea({id:$stateParams.id});


    $scope.updateArie = function(){
        if($scope.arie){
            areasAdminService.deleteOrUpdateareas.update({id:$stateParams.id},$scope.arie);
            $scope.arie = {};
            $state.go('ariiTerapeutice',{},{reload: true});
            $modalInstance.close();
        }
    };


    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $state.go('ariiTerapeutice',{},{reload: true});
        $modalInstance.close();
        $state.go('ariiTerapeutice',{},{reload: true});
    };
}]);
