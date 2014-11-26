/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('articlesAddCtrl', ['$scope','$rootScope' ,'ContentService','$stateParams','$sce','$filter','$modalInstance', function($scope,$rootScope,ContentService,$stateParams,$sce,$filter,$modalInstance){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
    };
}]);
