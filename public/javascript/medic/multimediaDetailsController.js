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
        $timeout(function(){
            //if(angular.element(".main-view-container").outerHeight()>angular.element($window).height())
            //    var margin = Math.floor(angular.element(".main-view-container").outerHeight() - angular.element($window).height() - angular.element('#footer').outerHeight());
            //else
            var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight()-15);
            angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 10)});
        },300);
    });
    console.log($rootScope.previousState);
    console.log($rootScope.currentState);
    $scope.amazon = $rootScope.pathAmazonDev;

    $scope.getVideoSrc = function(filepath){
        return $sce.trustAsResourceUrl($rootScope.pathAmazonDev+filepath)
    };

    $scope.okk = function () {
        $modalInstance.close();
    };

    $scope.cancell = function () {
        console.log($rootScope.previousState);
        $modalInstance.dismiss('cancel');
    };
}]);
