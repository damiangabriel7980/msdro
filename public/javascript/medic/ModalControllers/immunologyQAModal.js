/**
 * Created by user on 24.09.2015.
 */
app.controllerProvider.register('immunologyQAModal', ['$scope','$modalInstance','speaker','$sce', function ($scope,$modalInstance, speaker,$sce) {

    $scope.speaker = speaker;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.getVideoSrc = function(speaker){
      return $sce.trustAsResourceUrl(speaker.video);
    };
    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);