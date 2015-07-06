/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddMultimedia', ['$scope','$rootScope' ,'MultimediaAdminService','GroupsService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService', 'Success', 'Error', function($scope,$rootScope,MultimediaAdminService,GroupsService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService,Success,Error){
    $scope.selectedGroups = [];
    $scope.selectedAreas=[];

    GroupsService.groups.query().$promise.then(function(resp){
        $scope.groups = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    $scope.createMultimedia=function(){
        var id_groups=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }

        $scope.newMultimedia.groupsID = id_groups;
        $scope.newMultimedia['therapeutic-areasID'] = $scope.returnedAreas;
        $scope.newMultimedia.enable = true;
        $scope.newMultimedia.last_updated = new Date();
        MultimediaAdminService.multimedia.create({newMultimedia: $scope.newMultimedia}).$promise.then(function (resp) {
            console.log(resp);
            $modalInstance.close();
            $state.go('elearning.multimedia',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });

    };
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.closeModal = function () {
        $modalInstance.close();
        $state.go('elearning.multimedia',{},{reload: true});
    };
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
}]);
