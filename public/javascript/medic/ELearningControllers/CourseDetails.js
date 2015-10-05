/**
 * Created by Administrator on 17/09/15.
 */
app.controllerProvider.register('CourseDetails', ['$scope', '$rootScope', '$stateParams', 'CoursesService', '$state','$sce', '$timeout', 'Success', 'Error', '$modal', function($scope, $rootScope, $stateParams, CoursesService, $state,$sce, $timeout,Success,Error,$modal){

    var calculateCourseProgress = function(chapter){
        var progress = 0;
        var nrOfSlides = 0;
        for(var i = 0; i < chapter.listSubchapters.length; i++){
            for(var j = 0; j < chapter.listSubchapters[i].listSlides.length; j++ ){
                if($scope.slideViews[chapter.listSubchapters[i].listSlides[j]._id]){
                    if($scope.slideViews[chapter.listSubchapters[i].listSlides[j]._id].views)
                        progress += 1;
                    nrOfSlides += 1;
                }
            }
        }
        var objectToSend = {};
        objectToSend.progressInPercentage = Math.round((progress/nrOfSlides)*100);
        objectToSend.progress = progress;
        objectToSend.total = nrOfSlides;
        return objectToSend;
    };

    CoursesService.courses.query({id:$stateParams.courseId}).$promise.then(function(resp){
        $scope.course = Success.getObject(resp).courseDetails;
        $scope.slideViews = Success.getObject(resp).slideViews;
        for(var i = 0; i< $scope.course.listChapters.length ; i++){
            var extraChapterInfo = calculateCourseProgress($scope.course.listChapters[i]);
            $scope.course.listChapters[i].progress = extraChapterInfo.progress;
            $scope.course.listChapters[i].progressInPercentage = extraChapterInfo.progressInPercentage;
            $scope.course.listChapters[i].total = extraChapterInfo.total;
        }
    });
    $scope.toggle = function(scope) {
        scope.toggle();
    };



    var sortByKey = function(array,key){
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };

    if($stateParams.fromTest){
        if($stateParams.testScore){
            $modal.open({
                templateUrl: 'partials/medic/elearning/courses/testScore.ejs',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                windowClass: 'fade testScoreModal',
                controller: 'CourseTestResult',
                resolve:{
                    testScore: function () {
                        return $stateParams.testScore;
                    },
                    minimum: function () {
                        return $stateParams.minimum;
                    },
                    maximum: function () {
                        return $stateParams.maximum;
                    },
                    loadDeps: $rootScope.loadStateDeps(['CourseTestResult'])
                }
            });
        }
    }

    $scope.goToSlide = function(slide, subchapterId){
        $state.go('elearning.slide', {courseId:$stateParams.courseId, slideId : slide._id, subchapterId:subchapterId});
    };
}]);