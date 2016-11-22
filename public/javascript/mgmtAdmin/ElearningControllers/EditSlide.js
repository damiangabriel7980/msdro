/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditSlide', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService','customOrder', 'Utils', '$timeout', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService,customOrder, Utils, $timeout) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.courseId = $stateParams.courseId;
    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.slide = {};

    var gm;
    $(document).ready(function(){
        init();
    });

    $scope.courseNavigation = $stateParams.courseNav.split(",");

    function init(){
        ElearningService.slides.query({id: $stateParams.slideId}).$promise.then(function(resp){
            $scope.slide = Success.getObject(resp);
            $scope.$applyAsync();
            if($scope.slide.type == 'test')
                $scope.isTest = true;
            else
                $scope.isSlide = true;
            if($scope.slide.questions.length == 0){
                $scope.questions = [];
            }
            else
                $scope.questions = customOrder.sortNumbers($scope.slide.questions,'order');
            if($scope.isSlide){
                gm = $("#mgrid").gridmanager({
                    debug: 1,
                    customControls: {
                        global_col: []
                    },
                    controlAppend: "<div class='btn-group pull-right'><button title='Edit Source Code' type='button' class='btn btn-xs btn-primary gm-edit-mode'><span class='fa fa-code'></span></button><button title='Preview' type='button' class='btn btn-xs btn-primary gm-preview'><span class='fa fa-eye'></span></button>     <div class='dropdown pull-right gm-layout-mode'><button type='button' class='btn btn-xs btn-primary dropdown-toggle' data-toggle='dropdown'><span class='caret'></span></button> <ul class='dropdown-menu' role='menu'><li><a data-width='auto' title='Desktop'><span class='fa fa-desktop'></span> Desktop</a></li><li><a title='Tablet' data-width='768'><span class='fa fa-tablet'></span> Tablet</a></li><li><a title='Phone' data-width='640'><span class='fa fa-mobile-phone'></span> Phone</a></li></ul></div></div>",
                    tinymce: {
                        config: {
                            inline: true,
                            plugins: [
                                "advlist autolink lists link image charmap print preview anchor",
                                "searchreplace visualblocks code fullscreen",
                                "insertdatetime media table contextmenu paste"
                            ],
                            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
                        }
                    }
                });
                $("#gm-canvas").html($scope.slide.content);
                gm.data('gridmanager').initCanvas();
            }
        });
    };

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

    var createMap = function(arrayObject, indexToStart, forDelete){
        var mapping = [];
        for(var i = indexToStart; i < arrayObject.length; i++)
        {
            var objectToAdd = {};
            objectToAdd.id = arrayObject[i]._id;
            objectToAdd.order = forDelete ? arrayObject[i].order - 1 : arrayObject[i].order;
            mapping.push(objectToAdd);
        }
        return mapping;
    };

    $scope.deleteQuestion = function(id, idx){
        var questionsMap = createMap($scope.questions, idx + 1, true);
        ElearningService.updateIndex.update({questionsMap: questionsMap}).$promise.then(function(resp){
            ElearningService.questions.delete({id: id}).$promise.then(function (resp) {
                for(var i = idx + 1 ; i< $scope.questions.length; i++)
                    $scope.questions[i].order -= 1;
                $scope.questions.splice(idx,1);
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.deleteAnswer = function(id, question, idx){
        ElearningService.answers.delete({id: id}).$promise.then(function (resp) {
            question.answers.splice(idx,1);
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.saveChanges = function(){
        if($scope.isSlide){
            $scope.slide.type = 'slide';
            gm.data('gridmanager').deinitCanvas();
            $scope.slide.content = $("#gm-canvas").html();
            ElearningService.slides.update({id: $scope.slide._id},{slide: $scope.slide, isSlide: $scope.isSlide}).$promise.then(function(resp){
                $scope.statusAlert.type = "success";
                $scope.statusAlert.message = Success.getMessage(resp);
                $scope.statusAlert.newAlert = true;
                $scope.$parent.courses[$scope.courseNavigation[0]].listChapters[$scope.courseNavigation[1]].listSubchapters[$scope.courseNavigation[2]].listSlides[$scope.courseNavigation[3]].title = $scope.slide.title;
                gm.data('gridmanager').initCanvas();
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
            if(questionCursor){
                $scope.slide.last_updated = new Date();
                $scope.slide.questions = $scope.questions;
                $scope.slide.type = 'test';
                ElearningService.slides.update({id: $scope.slide._id},{slide: $scope.slide, isTest: $scope.isTest}).$promise.then(function(resp){
                    $scope.statusAlert.type = "success";
                    $scope.statusAlert.message = Success.getMessage(resp);
                    $scope.statusAlert.newAlert = true;
                    $scope.$parent.courses[$scope.courseNavigation[0]].listChapters[$scope.courseNavigation[1]].listSubchapters[$scope.courseNavigation[2]].listSlides[$scope.courseNavigation[3]].title = $scope.slide.title;
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }

        }
    };
}]);