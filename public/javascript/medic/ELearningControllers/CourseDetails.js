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

    var sortByKey = function(array,key){
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };

    $scope.goToSlide = function(slide, slideList){
        slideList = sortByKey(slideList,'order');
        $state.go('elearning.slide', {courseId:$stateParams.courseId, slideId : slide._id, slideList: slideList});
    };
}]);