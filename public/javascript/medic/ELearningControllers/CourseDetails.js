/**
 * Created by Administrator on 17/09/15.
 */
app.controllerProvider.register('CourseDetails', ['$scope', '$rootScope', '$stateParams', 'CoursesService', '$state','$sce', '$timeout', 'Success', 'Error', function($scope, $rootScope, $stateParams, CoursesService, $state,$sce, $timeout,Success,Error){
    CoursesService.courses.query({id:$stateParams.courseId}).$promise.then(function(resp){
        $scope.course = Success.getObject(resp).courseDetails;
        $scope.slideViews = Success.getObject(resp).slideViews;
    });
    $scope.toggle = function(scope) {
        scope.toggle();
    };
    $scope.goToSlide = function(slide){
        $state.go('elearning.slide', {slideId : slide._id});
    };
}]);