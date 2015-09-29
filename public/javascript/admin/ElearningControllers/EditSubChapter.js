/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('EditSubChapter', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    ElearningService.subchapters.query({id: $stateParams.subChapterId}).$promise.then(function(resp){
        $scope.subChapter = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
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

    $scope.updateSubChapter = function(){
        $scope.subChapter.last_updated = new Date();
        ElearningService.subchapters.update({id: $stateParams.subChapterId}, {subChapter: $scope.subChapter}).$promise.then(function(resp){
            $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);