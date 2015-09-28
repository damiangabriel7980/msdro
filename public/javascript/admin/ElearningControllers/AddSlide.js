/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('AddSlide', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.isSlide = true;
    $scope.isTest = false;

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    $scope.addSlide = function(){
        var listSlides=[];
        for(var i=0;i<$scope.selectedSlides.length;i++){
            listSlides.push($scope.selectedSlides[i]._id);
        }

        $scope.subChapter.last_updated = new Date();
        $scope.subChapter.date_created = new Date();
        $scope.subChapter.listSlides = listSlides;
        ElearningService.subchapters.create({chapterId: $stateParams.chapterId, subChapter: $scope.subChapter}).$promise.then(function(resp){
            $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);