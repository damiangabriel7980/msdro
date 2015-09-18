/**
 * Created by Administrator on 18/09/15.
 */
/**
 * Created by Administrator on 17/09/15.
 */
app.controllerProvider.register('SlideView', ['$scope','$rootScope' ,'CoursesService','$stateParams','$sce','$window','$timeout','$document','$state','Utils', 'Success', 'SpecialFeaturesService', function($scope,$rootScope,CoursesService,$stateParams,$sce,$window,$timeout,$document,$state,Utils,Success,SpecialFeaturesService){
    CoursesService.slides.query({id: $stateParams.slideId}).$promise.then(function(resp){
        $scope.slide = Success.getObject(resp);
    });

    $scope.backToChapter = function(){

    }

}]);