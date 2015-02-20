/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('articlesDeleteCtrl', ['$scope' ,'ContentService','$modalInstance','$state', 'idToDelete', function($scope,ContentService,$modalInstance,$state,idToDelete){

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.closeModal = function () {
        $modalInstance.close();
    };
    $scope.sterge=function(){
        ContentService.deleteOrUpdateContent.delete({id: idToDelete});
        $state.reload();
        $modalInstance.close();
    }
}]);
