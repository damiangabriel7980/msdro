/**
 * Created by Administrator on 18/09/15.
 */
/**
 * Created by Administrator on 17/09/15.
 */
app.controllerProvider.register('SlideView', ['$scope','$rootScope' ,'CoursesService','$stateParams','$sce','$window','$timeout','$document','$state','Utils', 'Success', 'SpecialFeaturesService', function($scope,$rootScope,CoursesService,$stateParams,$sce,$window,$timeout,$document,$state,Utils,Success,SpecialFeaturesService){
    CoursesService.slides.query({id: $stateParams.slideId}).$promise.then(function(resp){
        $scope.slide = Success.getObject(resp);

        //array of objects with answers to send to DB
        if($scope.slide.type == 'test'){
            $scope.mapQuestionsAnswers = {};
            for(var i=0; i< $scope.slide.questions.length; i++){
                $scope.mapQuestionsAnswers[$scope.slide.questions[i]._id] = [];
            }

            $scope.arrayOfQAndA = [];
            $scope.answersArray = [];
        }
        $scope.indexOfCurrentSlide = 0;
        $scope.slideList = $stateParams.slideList;
        if($scope.slideList){
            for(var j=0; j<$scope.slideList.length; j++){
                if($scope.slideList[j]._id == $scope.slide._id)
                    $scope.indexOfCurrentSlide = j;
            }
        }
    });

    $scope.checkAnswer = function(questionID, value, checked){
        var idx = $scope.mapQuestionsAnswers[questionID].indexOf(value);
        if (idx >= 0 && !checked) {
            $scope.mapQuestionsAnswers[questionID].splice(idx, 1);
        }
        if (idx < 0 && checked) {
            $scope.mapQuestionsAnswers[questionID].push(value);
        }
    };

    $scope.submitQuiz = function(){
        for (property in $scope.mapQuestionsAnswers) {
            var newObject = {};
            newObject[property] = $scope.mapQuestionsAnswers[property];
            $scope.arrayOfQAndA.push(newObject);
        }
        var dataToSend = {};
        dataToSend[$scope.slide._id] = $scope.arrayOfQAndA;
        CoursesService.slides.save({id: $scope.slide._id},$scope.mapQuestionsAnswers).$promise.then(function(resp){
            $state.go('elearning.chapters', {courseId:$stateParams.courseId});
        })
    };

    $scope.previousSlide = function(){
        $state.go('elearning.slide', {courseId:$stateParams.courseId, slideId : $scope.slideList[$scope.indexOfCurrentSlide-1]._id, slideList: $scope.slideList});
    };

    $scope.nextSlide = function(){
        $state.go('elearning.slide', {courseId:$stateParams.courseId, slideId : $scope.slideList[$scope.indexOfCurrentSlide+1]._id, slideList: $scope.slideList});
    };

    $scope.backToChapter = function(){
        $state.go('elearning.chapters', {courseId:$stateParams.courseId});
    };

}]);