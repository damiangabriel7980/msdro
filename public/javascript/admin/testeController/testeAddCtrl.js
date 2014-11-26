/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('testeAddCtrl', ['$scope','$rootScope' ,'testeAdminService','$stateParams','$sce','$filter','$modalInstance', function($scope,$rootScope,testeAdminService,$stateParams,$sce,$filter,$modalInstance){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
    };
}]);
