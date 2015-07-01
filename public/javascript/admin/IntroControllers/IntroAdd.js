/**
 * Created by miricaandrei23 on 27.02.2015.
 */
controllers.controller('IntroAdd', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','$modalInstance', 'GroupsService',function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,$modalInstance,GroupsService){
    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.selectedGroups = [];
    GroupsService.groups.query().$promise.then(function(resp){
        $scope.groups = resp.success;
    });
    $scope.saveIntro=function(){
        var groups_id = [];
        for(var i=0; i<$scope.selectedGroups.length; i++){
            groups_id.push($scope.selectedGroups[i]._id);
        }
        this.intro.groupsID = groups_id;
        this.intro.enabled = false;
        IntroService.intros.create({intro: this.intro}).$promise.then(function(resp){
            $scope.statusAlert.newAlert=true;
            $scope.statusAlert.message=resp.success.message;
        })
    };
    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height : 800,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
    $scope.closeModal=function(){
        $modalInstance.close();
        $state.reload();
    };
}]);