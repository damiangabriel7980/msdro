/**
 * Created by Administrator on 17/09/15.
 */
app.controllerProvider.register('CoursesView', ['$scope','$rootScope' ,'CoursesService','$stateParams','$sce','$window','$timeout','$document','$state','Utils', 'Success', 'SpecialFeaturesService', function($scope,$rootScope,CoursesService,$stateParams,$sce,$window,$timeout,$document,$state,Utils,Success,SpecialFeaturesService){
    CoursesService.courses.query().$promise.then(function(resp){
       $scope.courses = Success.getObject(resp);
    });
    $scope.navigateToCourseDetails = function (course) {
        $state.go('elearning.chapters', {courseId:course._id});
    };
    $scope.goToSlide = function(slide){
        $state.go('elearning.slide', {slideId : slide._id});
    };
}]);