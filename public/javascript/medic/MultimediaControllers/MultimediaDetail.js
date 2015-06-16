/**
 * Created by miricaandrei23 on 04.11.2014.
 */
/**
 * Created by miricaandrei23 on 03.11.2014.
 */
controllers.controller('MultimediaDetail', ['$scope','multimediaService','$stateParams','$modal','$log','$modalInstance','$rootScope','$sce','$state','idd','$window','$timeout',function ($scope,multimediaService,$stateParams, $modal, $log,$modalInstance,$rootScope,$sce,$state,idd,$window,$timeout) {

    multimediaService.getSingle.query({idd:idd}).$promise.then(function(result){
        $scope.selectedMultimedia = result;
        $scope.videosrc = $sce.trustAsResourceUrl($scope.amazon + $scope.selectedMultimedia.file_path);
        if(result.type==2){
            multimediaService.getSlides.query({multimedia_id:result._id}).$promise.then(function (slides) {
                $scope.slidesArray = slides;
            });
        }
    });
    $scope.amazon = $rootScope.pathAmazonDev;

    $scope.getVideoSrc = function(filepath){
        return $sce.trustAsResourceUrl($rootScope.pathAmazonDev+filepath)
    };
    $stateParams.idMulti=null;
    $scope.okk = function () {
        $modalInstance.close();
        $state.go('elearning.multimedia.multimediaByArea',{idArea:0,idMulti: null});
    };
    $scope.cancell = function () {
        $modalInstance.dismiss('cancel');
        $state.go('elearning.multimedia.multimediaByArea',{idArea:0,idMulti: null});
    };
}]);
