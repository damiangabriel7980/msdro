/**
 * Created by miricaandrei23 on 04.11.2014.
 */
/**
 * Created by miricaandrei23 on 03.11.2014.
 */
cloudAdminControllers.controller('multimediaDetailsController', ['$scope','multimediaService','$stateParams','$modal','$log','$modalInstance','$rootScope','$sce','$state','idd','$window','$timeout',function ($scope,multimediaService,$stateParams, $modal, $log,$modalInstance,$rootScope,$sce,$state,idd,$window,$timeout) {

    multimediaService.getSingle.query({idd:idd}).$promise.then(function(result){
        $scope.selectedMultimedia = result;
        $scope.videosrc = $sce.trustAsResourceUrl($scope.amazon + $scope.selectedMultimedia.file_path);
        if(result.type==2){
            multimediaService.getSlides.query({multimedia_id:result._id}).$promise.then(function (slides) {
                console.log(slides);
                $scope.slidesArray = slides;
            });
        }
    });
    $scope.amazon = $rootScope.pathAmazonDev;

    $scope.getVideoSrc = function(filepath){
        return $sce.trustAsResourceUrl($rootScope.pathAmazonDev+filepath)
    };

    $scope.okk = function () {
        $modalInstance.close();
    };
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    $scope.cancell = function () {
        console.log($rootScope.previousState);
        $modalInstance.dismiss('cancel');
    };
}]);
