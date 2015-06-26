/**
 * Created by miricaandrei23 on 04.11.2014.
 */
/**
 * Created by miricaandrei23 on 03.11.2014.
 */
controllers.controller('MultimediaDetail', ['$scope','multimediaService','$stateParams','$modal','$log','$rootScope','$sce','$state','idMultimedia','$window','$timeout','Utils', function ($scope,multimediaService,$stateParams, $modal, $log,$rootScope,$sce,$state,idMultimedia,$window,$timeout,Utils) {
    $scope.selectedMultimedia={
        title: '',
        description: ''
    };
    multimediaService.multimedia.query({idMultimedia:idMultimedia}).$promise.then(function(result){
        $scope.selectedMultimedia = result.success;
    });
    $scope.getVideoSrc = function(filepath){
        return $sce.trustAsResourceUrl($rootScope.pathAmazonDev+filepath)
    };
    $stateParams.idMulti=null;
    $scope.goToMultimedia = function () {
        $state.go('elearning.multimedia.multimediaByArea',{idArea:0,idMulti: null},{},{reload: true});
    };
}]);
