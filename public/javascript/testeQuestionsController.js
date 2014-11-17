/**
 * Created by miricaandrei23 on 05.11.2014.
 */
cloudAdminControllers.controller('testeQuestionsController', ['$scope','$rootScope' ,'testeService','$stateParams','$sce', '$modalInstance','$location','$state','$timeout', function($scope,$rootScope,testeService,$stateParams,$sce,$modalInstance,$location,$state,$timeout) {
    testeService.getByTest.query({id:$stateParams.id}).$promise.then(function(result){
        $scope.questions=result["questions"];
        $scope.newQuestions = [];
        $scope.answersFiltered=[];
        $scope.len = $scope.questions.length;
        for(var i = 0; i < $scope.len ; i++) {
            var idx = Math.floor(Math.random() * $scope.questions.length);
            $scope.newQuestions.push($scope.questions[idx]);

            $scope.questions.splice(idx, 1);
        }
        for(var k=0;k<$scope.newQuestions.length;k++) {
            for (var j = 0; j < result["answers"].length; j++) {
                if ($scope.newQuestions[k].answersID.indexOf(result["answers"][j]._id)>-1)
                    $scope.answersFiltered.push(result["answers"][j]);
            }
        }
        if($scope.newQuestions.length==1)
            $scope.hidef='show';
        else
            $scope.hidef='hide';
       $scope.countdownT=parseInt(result["test"][0].time*60);
    });
    $timeout(function() {
        $scope.par=$scope.countdownT;
        $("timer").start;
    }, 3000);
    $scope.contor=0;
    $scope.clasa='hide';
    $scope.hideNext='show';
    $scope.hideFinish=$scope.hidef;
    $scope.nextQuestion= function(){
        $scope.clasa='show';
        $scope.contor++;
        if($scope.contor===$scope.newQuestions.length-1) {
               $scope.hideFinish = 'show';
            $scope.hideNext='hide';
        }
    }
    $scope.previousQuestion= function(){
        if($scope.contor===$scope.newQuestions.length-1)
        {
            $scope.hideFinish='hide';
            $scope.hideNext='show';
        }
            $scope.contor--;
        if($scope.contor==0)
            $scope.clasa='hide';
    }
    $scope.finishJob = function(){
            $modalInstance.close();
            }
}]);