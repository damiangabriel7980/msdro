/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('articlesDeleteCtrl', ['$scope','$rootScope' ,'ContentService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,ContentService,$stateParams,$sce,$filter,$modalInstance,$state){

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $state.go('continut.articole');
        $modalInstance.close();
    };
    $scope.sterge=function(){
        ContentService.deleteOrUpdateContent.delete({id:$stateParams.id});
        $state.go('continut.articole');
        $modalInstance.close();
    }
}]);
