/**
 * Created by Administrator on 18/09/15.
 */
/**
 * Created by Administrator on 17/09/15.
 */
app.controllerProvider.register('SlideView', ['$scope','$rootScope' ,'CoursesService','$stateParams','$sce','$window','$timeout','$document','$state','Utils', 'Success', 'SpecialFeaturesService', function($scope,$rootScope,CoursesService,$stateParams,$sce,$window,$timeout,$document,$state,Utils,Success,SpecialFeaturesService){
    CoursesService.slides.query({id: $stateParams.slideId}).$promise.then(function(resp){
        $scope.slide = Success.getObject(resp);


        //check for previous slide in order to show the navigation button
        CoursesService.subchapters.query({id: $stateParams.subchapterId}).$promise.then(function(resp){
            $scope.indexOfCurrentSlide = 0;
            $scope.slideList = Success.getObject(resp).listSlides;
            if($scope.slideList){
                for(var j=0; j<$scope.slideList.length; j++){
                    if($scope.slideList[j]._id == $scope.slide._id)
                        $scope.indexOfCurrentSlide = j;
                }
            }
        });
        CoursesService.courses.query({id:$stateParams.courseId}).$promise.then(function(resp){
            $scope.slideViews = Success.getObject(resp).slideViews;
            if($scope.indexOfCurrentSlide != 0)
                $scope.pSlide = $scope.slideList[$scope.indexOfCurrentSlide-1];
            else
                $scope.previousSlide = false;
            if($scope.indexOfCurrentSlide != $scope.slideList.length - 1)
                $scope.nSlide = $scope.slideList[$scope.indexOfCurrentSlide+1];
            else
                $scope.nextSlide = false;

            if($scope.pSlide || $scope.nSlide){
                    if($scope.pSlide && $scope.pSlide.type == 'test'){
                        if($scope.slideViews[$scope.pSlide._id]){
                            if($scope.slideViews[$scope.pSlide._id].views >= $scope.pSlide.retake)
                                $scope.previousSlide = false;
                            else
                                $scope.previousSlide = true;
                        }
                    }
                if($scope.nSlide && $scope.nSlide.type == 'test'){
                    if($scope.slideViews[$scope.nSlide._id]){
                        if($scope.slideViews[$scope.nSlide._id].views >= $scope.nSlide.retake)
                            $scope.nextSlide = false;
                        else
                            $scope.nextSlide = true;
                    }
                }
            }
        });
        //array of objects with answers to send to DB
        if($scope.slide.type == 'test'){
            $scope.mapQuestionsAnswers = {};
            for(var i=0; i< $scope.slide.questions.length; i++){
                $scope.mapQuestionsAnswers[$scope.slide.questions[i]._id] = [];
            }
            $scope.arrayOfQAndA = [];
            $scope.answersArray = [];
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
            $state.go('elearning.chapters', {courseId:$stateParams.courseId}, {reload: true});
        })
    };

    $scope.goPrevious = function(){
        $state.go('elearning.slide', {courseId:$stateParams.courseId, subchapterId: $stateParams.subchapterId, slideId : $scope.slideList[$scope.indexOfCurrentSlide-1]._id});
    };

    $scope.goNext = function(){
        $state.go('elearning.slide', {courseId:$stateParams.courseId, subchapterId: $stateParams.subchapterId, slideId : $scope.slideList[$scope.indexOfCurrentSlide+1]._id});
    };

    $scope.backToChapter = function(){
        $state.go('elearning.chapters', {courseId:$stateParams.courseId});
    };

}]);