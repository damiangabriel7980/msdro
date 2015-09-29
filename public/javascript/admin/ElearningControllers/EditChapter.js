/**
 * Created by Administrator on 17/09/15.
 */
/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditChapter', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', 'Utils', '$timeout', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService, Utils, $timeout) {

    $scope.loadEditor = function(){
        $(document).ready(function(){
            $timeout(function(){
                $("#mgrid").gridmanager({
                    debug: 1,
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
            },200)
        });
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    ElearningService.chapters.query({id: $stateParams.chapterId}).$promise.then(function(resp){
        $scope.chapter = Success.getObject(resp);
        $scope.loadEditor();
    });

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    $scope.saveChapter = function(){
        $scope.chapter.last_updated = new Date();
        $scope.chapter.description = angular.element('#gm-canvas').html();
        ElearningService.chapters.update({id: $stateParams.chapterId} ,{chapter: $scope.chapter}).$promise.then(function(resp){
            $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);