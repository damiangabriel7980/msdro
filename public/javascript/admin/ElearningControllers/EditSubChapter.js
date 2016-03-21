/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditSubChapter', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', 'Utils', '$timeout', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService,Utils,$timeout) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    var gm;
    $(document).ready(function(){
        init();
    });

    $scope.courseNavigation = $stateParams.courseNav.split(",");

    function init(){
        ElearningService.subchapters.query({id: $stateParams.subChapterId}).$promise.then(function(resp){
            $scope.subChapter = Success.getObject(resp);
            $('#mgrid').html($scope.subChapter.description);
            $('#mgrid').gridEditor({
                new_row_layouts: [[12], [6, 6], [9, 3], [3, 3, 3, 3], [4, 4, 4]],
                content_types: ['ckeditor']
            });
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    }

    $scope.updateSubChapter = function(){
        $scope.subChapter.description = $("#mgrid").gridEditor('getHtml');
        ElearningService.subchapters.update({id: $stateParams.subChapterId}, {subChapter: $scope.subChapter}).$promise.then(function(resp){
            $scope.$parent.courses[$scope.courseNavigation[0]].listChapters[$scope.courseNavigation[1]].listSubchapters[$scope.courseNavigation[2]].title = $scope.subChapter.title;
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);