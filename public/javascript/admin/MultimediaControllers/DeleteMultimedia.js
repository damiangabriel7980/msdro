/**
 * Created by miricaandrei23 on 18.05.2015.
 */
controllers.controller('DeleteMultimedia', ['$scope','$rootScope' ,'MultimediaAdminService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,MultimediaAdminService,$stateParams,$sce,$filter,$modalInstance,$state){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
        $state.reload();
    };
}]);
