/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditSlide', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService) {

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
        if($scope.slide.questions.length == 0)
            $scope.questions = [{
                order: 1,
                text: 'New question',
                answers: [{
                    ratio: 0,
                    text: 'New Answer'
                }]
            }];
        else
            $scope.questions = $scope.slide.questions;
    });

    $scope.saveChanges = function(){
        if($scope.isSlide){
            $scope.slide.last_updated = new Date();
            ElearningService.slides.update({id: $scope.slide._id},{slide: $scope.slide, isSlide: $scope.isSlide}).$promise.then(function(resp){
                $scope.statusAlert.type = "success";
                $scope.statusAlert.message = Success.getMessage(resp);
                $scope.statusAlert.newAlert = true;
            });
        }else{
            $scope.slide.last_updated = new Date();

        }
    };
}]);