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
    $scope.courseNavigation = $stateParams.courseNav.split(",");

    function init(){
        ElearningService.chapters.query({id: $stateParams.chapterId}).$promise.then(function(resp){
            $scope.chapter = Success.getObject(resp);
            $('#mgrid').html($scope.chapter.description);
            $('#mgrid').gridEditor({
                new_row_layouts: [[12], [6, 6], [9, 3], [3, 3, 3, 3], [4, 4, 4]],
                content_types: ['ckeditor']
            });
        });
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.saveChapter = function(){
        $scope.chapter.description =  $("#mgrid").gridEditor('getHtml');
        ElearningService.chapters.update({id: $stateParams.chapterId} ,{chapter: $scope.chapter}).$promise.then(function(resp){
            $scope.$parent.courses[$scope.courseNavigation[0]].listChapters[$scope.courseNavigation[1]].title = $scope.chapter.title;
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);