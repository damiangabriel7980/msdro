/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('ariiTerapeuticeAddCtrl', ['$scope','$rootScope' ,'areasAdminService','$stateParams','$sce','$filter','$modalInstance', function($scope,$rootScope,areasAdminService,$stateParams,$sce,$filter,$modalInstance){

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
        }
    };


    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
    };
}]);
