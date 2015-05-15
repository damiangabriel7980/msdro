/**
 * Created by miricaandrei23 on 04.11.2014.
 */
/**
 * Created by miricaandrei23 on 03.11.2014.
 */
controllers.controller('MultimediaDetailMobile', ['$scope','multimediaService','$stateParams','$log','$rootScope','$sce','$state','$window','$timeout',function ($scope,multimediaService,$stateParams, $log,$rootScope,$sce,$state,$window,$timeout) {
    $scope.selectedMultimedia={
        title: '',
        description: ''
    };
    multimediaService.getSingle.query({idd: $stateParams.id}).$promise.then(function(result){
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
        $state.go('elearning.multimedia.multimediaByArea',{idArea:0,idMulti: null});
    };
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    $scope.cancell = function () {
        $state.go('elearning.multimedia.multimediaByArea',{idArea:0,idMulti: null});
    };
}]);
