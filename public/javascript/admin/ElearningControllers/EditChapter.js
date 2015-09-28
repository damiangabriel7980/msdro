/**
 * Created by Administrator on 17/09/15.
 */
/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditChapter', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    ElearningService.chapters.query({id: $stateParams.chapterId}).$promise.then(function(resp){
        $scope.chapter = Success.getObject(resp);
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
        var listSubChapters=[];
        for(var i=0;i<$scope.selectedSubchapters.length;i++){
            listSubChapters.push($scope.selectedSubchapters[i]._id);
        }

        $scope.chapter.last_updated = new Date();
        $scope.chapter.listSubchapters = listSubChapters;
        ElearningService.chapters.update({id: $stateParams.chapterId} ,{chapter: $scope.chapter}).$promise.then(function(resp){
            $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);