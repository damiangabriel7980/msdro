/**
 * Created by Administrator on 17/09/15.
 */
/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditChapter', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', 'Utils', '$timeout', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService, Utils, $timeout) {
    var gm;
        $(document).ready(function(){
            init();
        });

    function init(){
        ElearningService.chapters.query({id: $stateParams.chapterId}).$promise.then(function(resp){
            $scope.chapter = Success.getObject(resp);
            gm = $("#mgrid").gridmanager({
                debug: 1,
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
            $("#gm-canvas").html($scope.chapter.description);
            gm.data('gridmanager').initCanvas();
        });
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.saveChapter = function(){
        gm.data('gridmanager').deinitCanvas();
        $scope.chapter.description =  $("#gm-canvas").html();
        ElearningService.chapters.update({id: $stateParams.chapterId} ,{chapter: $scope.chapter}).$promise.then(function(resp){
            $scope.$parent.getCourses();
            gm.data('gridmanager').initCanvas();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);