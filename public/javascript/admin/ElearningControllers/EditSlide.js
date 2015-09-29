/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditSlide', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService','customOrder', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService,customOrder) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.statusAlert = {newAlert:false, type:"", message:""};

    $scope.courseId = $stateParams.courseId;

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    ElearningService.slides.query({id: $stateParams.slideId}).$promise.then(function(resp){
       $scope.slide = Success.getObject(resp);
        if($scope.slide.type == 'test')
            $scope.isTest = true;
        else
            $scope.isSlide = true;
        if($scope.slide.questions.length == 0){
            var Question = {
                order: 1,
                text: 'New question',
                answers: [
                    {
                        ratio: 0,
                        text: 'New Answer'
                    },
                    {
                        ratio: 0,
                        text: 'New Answer'
                    },
                    {
                        ratio: 0,
                        text: 'New Answer'
                    }
                ]
            };
            ElearningService.questions.create({id: $stateParams.slideId, question: Question}).$promise.then(function (resp) {
                $scope.questions = [];
                $scope.questions.push(Success.getObject(resp));
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        }
        else
            $scope.questions = customOrder.sortNumbers($scope.slide.questions,'order');
    });

    $scope.addQuestion = function(){
        var Question = {
            order: $scope.questions.length + 1,
            text: 'New question',
            answers: [
                {
                ratio: 0,
                text: 'New Answer'
                },
                {
                    ratio: 0,
                    text: 'New Answer'
                },
                {
                    ratio: 0,
                    text: 'New Answer'
                }
            ]
        };
        ElearningService.questions.create({id: $stateParams.slideId, question: Question}).$promise.then(function (resp) {
            Question = Success.getObject(resp);
            $scope.questions.push(Question);
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.addAnswer = function(index){
        var newAnswer = {
            ratio : 0,
            text: 'New answer'
        };
        ElearningService.answers.create({id: $scope.questions[index]._id, answer: newAnswer}).$promise.then(function (resp) {
            $scope.questions[index].answers.push(Success.getObject(resp));
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.deleteQuestion = function(id){
        ElearningService.questions.delete({id: id}).$promise.then(function (resp) {
            $state.reload();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.deleteAnswer = function(id){
        ElearningService.answers.delete({id: id}).$promise.then(function (resp) {
            $state.reload();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.saveChanges = function(){
        if($scope.isSlide){
            $scope.slide.last_updated = new Date();
            $scope.slide.type = 'slide';
            ElearningService.slides.update({id: $scope.slide._id},{slide: $scope.slide, isSlide: $scope.isSlide}).$promise.then(function(resp){
                $scope.statusAlert.type = "success";
                $scope.statusAlert.message = Success.getMessage(resp);
                $scope.statusAlert.newAlert = true;
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        }else{
            var questionCursor = false;
            var overall = 0;
            var checkSum = 0;
            for(var i = 0; i< $scope.questions.length; i++){
                for(var j=0; j< $scope.questions[i].answers.length; j++){
                    checkSum += $scope.questions[i].answers[j].ratio;
                    if($scope.questions[i].answers[j].ratio > 0)
                        overall += $scope.questions[i].answers[j].ratio;
                }
                if(checkSum != 0){
                    $scope.statusAlert.type = "danger";
                    $scope.statusAlert.message = 'Intrebarea cu numarul ' + $scope.questions[i].order + ' nu are ponderi valide!';
                    $scope.statusAlert.newAlert = true;
                }
                if($scope.questions[i].order == $scope.questions.length && checkSum == 0)
                    questionCursor = true;
            }
            if(questionCursor && overall == $scope.slide.maximum){
                $scope.slide.last_updated = new Date();
                $scope.slide.questions = $scope.questions;
                $scope.slide.type = 'test';
                ElearningService.slides.update({id: $scope.slide._id},{slide: $scope.slide, isTest: $scope.isTest}).$promise.then(function(resp){
                    $scope.statusAlert.type = "success";
                    $scope.statusAlert.message = Success.getMessage(resp);
                    $scope.statusAlert.newAlert = true;
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }else if(overall != $scope.slide.maximum && checkSum == 0) {
                $scope.statusAlert.type = "danger";
                $scope.statusAlert.message = 'Suma ponderilor intrebarilor nu este egala cu punctajul testului!';
                $scope.statusAlert.newAlert = true;
            }

        }
    };
}]);