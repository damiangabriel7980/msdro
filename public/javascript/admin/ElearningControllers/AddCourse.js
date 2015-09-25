/**
 * Created by Administrator on 17/09/15.
 */
controllers.controller('AddCourse', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'GroupsService', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, GroupsService) {

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.selectedGroups = [];
    $scope.selectedChapters = [];

    GroupsService.groups.query().$promise.then(function (resp) {
        $scope.allGroups = Success.getObject(resp);
    });

    ElearningService.chapters.query().$promise.then(function(resp){
        $scope.allChapters = Success.getObject(resp);
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

    $scope.saveCourse = function(){
        var id_groups=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }

        var listChapters=[];
        for(var i=0;i<$scope.selectedChapters.length;i++){
            listChapters.push($scope.selectedChapters[i]._id);
        }

        $scope.course.last_updated = new Date();
        $scope.course.date_created = new Date();
        $scope.course.listChapters = listChapters;
        $scope.course.groupsID = id_groups;
        ElearningService.courses.create({course: $scope.course}).$promise.then(function(resp){
           $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };
}]);