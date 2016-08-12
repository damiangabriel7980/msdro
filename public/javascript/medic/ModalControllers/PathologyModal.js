/**
 * Created by andrei.mirica on 11/08/16.
 */
app.controllerProvider.register('PathologyModal', ['$scope', '$rootScope', '$sce', '$modal','$modalInstance', 'videoURL', 'pathologyName', function($scope, $rootScope, $sce, $modal,$modalInstance, videoURL, pathologyName) {

    $scope.pathologyVideo = function(){
        return $sce.trustAsResourceUrl(videoURL);
    };

    $scope.pathologyName = pathologyName;

    $scope.closeModal=function(){
        if(angular.element('video')[0])
            angular.element('video')[0].pause();
        $modalInstance.close();
    };

}]);