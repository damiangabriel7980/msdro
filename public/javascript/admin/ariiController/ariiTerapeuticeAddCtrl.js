/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('ariiTerapeuticeAddCtrl', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance,$state){

    $scope.arie={
        has_children: false,
        last_updated: new Date(),
        name: "",
        enabled:true
    };

    $scope.addArie = function(){
        if($scope.arie){
            areasAdminService.getAll.save($scope.arie);
            $scope.arie = {};
            $modalInstance.close();
            $state.go('ariiTerapeutice',{},{reload: true});
        }
    };


    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
        $state.go('ariiTerapeutice',{},{reload: true});
    };
}]);
