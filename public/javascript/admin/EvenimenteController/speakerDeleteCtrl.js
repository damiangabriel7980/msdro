/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('speakerDeleteCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$modalInstance,$state){

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $state.go('continut.evenimente');
        $modalInstance.close();
    };
    $scope.stergeSpeaker=function(){
        EventsAdminService.deleteOrUpdateSpeakers.delete({id:$stateParams.id});
        $state.go('continut.evenimente');
        $modalInstance.close();
    }
}]);
