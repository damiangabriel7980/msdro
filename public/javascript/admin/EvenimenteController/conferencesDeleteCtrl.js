/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('conferencesDeleteCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$modalInstance,$state){

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $state.go('continut.evenimente');
        $modalInstance.close();
    };
    $scope.stergeConferinta=function(){
        EventsAdminService.deleteOrUpdateConferences.delete({id:$stateParams.id}).$promise.then(function(result){
            console.log(result);
        });
        $state.go('continut.evenimente');
        $modalInstance.close();
    }
}]);
