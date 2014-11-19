/**
 * Created by miricaandrei23 on 05.11.2014.
 */
cloudAdminControllers.controller('testeQuestionsController', ['$scope','$rootScope' ,'testeService','$stateParams','$sce', '$modalInstance','$location','$state','$timeout','$cookies','userService', function($scope,$rootScope,testeService,$stateParams,$sce,$modalInstance,$location,$state,$timeout,$cookies,userService) {
    testeService.getQ.query({id:$stateParams.id,idd:$stateParams.idd}).$promise.then(function(result){
        $scope.questions=result["questions"];
        $scope.newQuestions = [];
        $scope.answersFiltered=result["answers"];
        $scope.len = $scope.questions.length;
        for(var i = 0; i < $scope.len ; i++) {
            var idx = Math.floor(Math.random() * $scope.questions.length);
            $scope.newQuestions.push($scope.questions[idx]);
            $scope.questions.splice(idx, 1);
        }
        $scope.test=result["test"];
       $scope.countdownT=parseInt(result["test"][0].time*60);
        $scope.chk= new Array($scope.answersFiltered.length);
        for(var i=0;i<$scope.chk.length;i++)
            { $scope.chk[i]=false;}
        if($scope.test[0].questionsID.length-1==$scope.cc)
        {
            $scope.hideNext='hide';
            $scope.hideFinish='show';
        }
        $scope.ansForChk.push($scope.answersFiltered);
    });
    $timeout(function() {
        $scope.par=$scope.countdownT;
        $scope.$broadcast('timer-set-countdown', $scope.par);
        $scope.$broadcast('timer-start');
    }, 2000);
$scope.modifyChk = function(index)
{
    if($scope.chk[index]==false)
        $scope.chk[index]=true;
    else
        $scope.chk[index]=false
}
    $scope.chkFinal=[];
    $scope.ansForChk=[];
    $scope.contor=0;
    $scope.cc=0
    $scope.clasa='hide';
    $scope.hideNext='show';
    $scope.selectedAnswers=[];
    $scope.hideFinish='hide';
    $scope.score_obtained=0;
    $scope.nextQuestion= function(){
        $scope.clasa='show';

        if(!$scope.chkFinal[$scope.cc]) {
            $scope.chkFinal.push($scope.chk);

        }
        $scope.cc+=1;
        if($scope.test[0].questionsID.length-1==$scope.cc)
        {
            $scope.hideNext='hide';
            $scope.hideFinish='show';
        }
            testeService.getQ.query({
                id: $stateParams.id,
                idd: $scope.test[0].questionsID[$scope.cc]
            }).$promise.then(function (result) {
                $scope.questions = result["questions"];
                $scope.newQuestions = [];
                $scope.answersFiltered = result["answers"];
                    if(!$scope.ansForChk[$scope.cc])
                    {
                         $scope.ansForChk.push($scope.answersFiltered);
                    }
                $scope.len = $scope.questions.length;
                for (var i = 0; i < $scope.len; i++) {
                    var idx = Math.floor(Math.random() * $scope.questions.length);
                    $scope.newQuestions.push($scope.questions[idx]);
                    $scope.questions.splice(idx, 1);
                }
                    if($scope.chkFinal[$scope.cc])
                        $scope.chk=$scope.chkFinal[$scope.cc];
                    else
                    {
                        $scope.chk= new Array($scope.answersFiltered.length);
                        for(var i=0;i<$scope.chk.length;i++)
                        { $scope.chk[i]=false;}
                    }

            })
        }
    $scope.previousQuestion= function(){
        $scope.cc-=1;
        if($scope.test[0].questionsID.length-2==$scope.cc)
        {
            $scope.hideNext='show';
            $scope.hideFinish='hide';
        }
        $scope.chk=$scope.chkFinal[$scope.cc];
        testeService.getQ.query({
            id: $stateParams.id,
            idd: $scope.test[0].questionsID[$scope.cc]
        }).$promise.then(function (result) {
                $scope.questions = result["questions"];
                $scope.newQuestions = [];
                $scope.answersFiltered = result["answers"];
                $scope.len = $scope.questions.length;
                for (var i = 0; i < $scope.len; i++) {
                    var idx = Math.floor(Math.random() * $scope.questions.length);
                    $scope.newQuestions.push($scope.questions[idx]);

                    $scope.questions.splice(idx, 1);
                }
            })

        if($scope.cc==0)
            $scope.clasa='hide';
    }
    $scope.finishJob = function(){
        if(!$scope.chkFinal[$scope.cc])
            $scope.chkFinal.push($scope.chk);
        if($scope.chkFinal.length==1) {
            for (var j = 0; j < $scope.chk.length; j++) {
                if ($scope.chk[j] == true && $scope.chk[j] == $scope.answersFiltered[j].correct)
                    $scope.score_obtained += 5;
            }
            var obj=angular.fromJson('{"score":'+ $scope.score_obtained + '}');
            $scope.vari2=userService.postTest.save(obj);
            $modalInstance.close();
        }
      else
        {
            for(var i=0;i<$scope.chkFinal.length;i++)
            {
                for(var j=0;j<$scope.chkFinal[i].length;j++)
                {
                    if ($scope.chkFinal[i][j] == true && $scope.chkFinal[i][j] == $scope.ansForChk[i][j].correct)
                        $scope.score_obtained += 5;
                }
            }
            $scope.obj=angular.fromJson('{"score":'+ $scope.score_obtained + '}');
            $scope.vari2=userService.postTest.save($scope.obj);
            $modalInstance.close();
        }
    }
    $scope.finished=function()
    {
        if(!$scope.chkFinal[$scope.cc])
            $scope.chkFinal.push($scope.chk);
        if($scope.chkFinal.length==1) {
            for (var j = 0; j < $scope.chk.length; j++) {
                if ($scope.chk[j] == true && $scope.chk[j] == $scope.answersFiltered[j].correct)
                    $scope.score_obtained += 5;
            }
            var obj=angular.fromJson('{"score":'+ $scope.score_obtained + '}');
            $scope.vari2=userService.postTest.save(obj);
            $modalInstance.close();
        }
        else
        {
            for(var i=0;i<$scope.chkFinal.length;i++)
            {
                for(var j=0;j<$scope.chkFinal[i].length;j++)
                {
                    if ($scope.chkFinal[i][j] == true && $scope.chkFinal[i][j] == $scope.ansForChk[i][j].correct)
                        $scope.score_obtained += 5;
                }
            }
            $scope.obj=angular.fromJson('{"score":'+ $scope.score_obtained + '}');
            $scope.vari2=userService.postTest.save($scope.obj);
            $modalInstance.close();
        }
    }
}]);