/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddMultimedia', ['$scope','$rootScope' ,'MultimediaAdminService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,MultimediaAdminService,$stateParams,$sce,$filter,$modalInstance,$state){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $modalInstance.close();
        $state.reload();
    };
}]);
