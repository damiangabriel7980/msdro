/**
 * Created by miricaandrei23 on 04.11.2014.
 */
/**
 * Created by miricaandrei23 on 03.11.2014.
 */
cloudAdminControllers.controller('multimediaDetailsController', ['$scope','multimediaService','$stateParams','$modal','$log','$modalInstance','$rootScope','$sce',function ($scope,multimediaService,$stateParams, $modal, $log,$modalInstance,$rootScope,$sce) {
    multimediaService.getSingle.query({idd:$stateParams.idd}).$promise.then(function(result){
        $scope.selectedMultimedia = result;
        $scope.videosrc = $sce.trustAsResourceUrl($scope.amazon + $scope.selectedMultimedia.file_path);
    });

    $scope.amazon = $rootScope.pathAmazonDev;

    $scope.getVideoSrc = function(filepath){
        return $sce.trustAsResourceUrl($rootScope.pathAmazonDev+filepath)
    };

    $scope.okk = function () {
        $modalInstance.close();
    };

    $scope.cancell = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
