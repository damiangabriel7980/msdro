/**
 * Created by miricaandrei23 on 09.01.2015.
 */
cloudAdminControllers.controller('MultimediaBeforeQuizController', ['$scope','$rootScope' ,'quizesService','$stateParams','$sce', '$modalInstance','$location','$state','$timeout','multimediaService','growl', function($scope,$rootScope,quizesService,$stateParams,$sce,$modalInstance,$location,$state,$timeout,multimediaService,growl) {

    quizesService.getMultimedia.query({id:$stateParams.id}).$promise.then(function(result){
        $scope.selectedMultimedia = result;
        $scope.idQuiz=$stateParams.id;
        $scope.videosrc = $sce.trustAsResourceUrl($scope.amazon + $scope.selectedMultimedia.file_path);
        if(result.type==2){
            multimediaService.getSlides.query({multimedia_id:result._id}).$promise.then(function (slides) {
                console.log(slides);
                $scope.slidesArray = slides;
            });
        }
    });
    quizesService.getByQuiz.query({id:$stateParams.id}).$promise.then(function(result){
        $scope.attachedTest=result;
        $scope.idQ=$scope.attachedTest.questionsID[0];
    });
    $scope.amazon = $rootScope.pathAmazonDev;

    $scope.getVideoSrc = function(filepath){
        return $sce.trustAsResourceUrl($rootScope.pathAmazonDev+filepath)
    };

    $scope.okk = function () {
        $state.go('elearning.teste');
        $modalInstance.close();
    };

    $scope.cancell = function () {
        $state.go('elearning.teste');
        $modalInstance.dismiss('cancel');
    };

}]);