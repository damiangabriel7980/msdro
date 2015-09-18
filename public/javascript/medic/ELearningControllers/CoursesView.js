/**
 * Created by Administrator on 17/09/15.
 */
app.controllerProvider.register('CoursesView', ['$scope','$rootScope' ,'multimediaService','$stateParams','$sce','$modal','$window','$timeout','$document','$state','Utils', 'Success', 'SpecialFeaturesService', '$location', function($scope,$rootScope,multimediaService,$stateParams,$sce,$modal,$window,$timeout,$document,$state,Utils,Success,SpecialFeaturesService, $location){
    $scope.courses = [{
        _id: 'dsd2321ff',
        title: 'Un curs oarecare',
        listChapters: [
            {
                _id: '00932jcc',
                title: 'Un chapter oarecare',
                listSubChapters: [
                    {
                        _id: 'dw0222345',
                        title: 'ddsdafwfw',
                        listSlides: [
                            {
                                _id: 'sa2323e',
                                title: 'fisrsf',
                                content: 'dwafgafavcava',
                                type: 'text'
                            }
                        ]
                    }
                ]
            }
        ]
    }];
    $scope.selectFirstMenuItem = function () {
        var slideId = $scope.courses[0].listChapters[0].listSubChapters[0].listSlides[0]._id;
        $state.go('elearning.courses.allCourses', {slideId: slideId});
    };
    $scope.toggle = function(scope) {
        scope.toggle();
    };
}]);