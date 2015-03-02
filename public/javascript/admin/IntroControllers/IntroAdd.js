/**
 * Created by miricaandrei23 on 27.02.2015.
 */
controllers.controller('IntroAdd', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','$modalInstance', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,$modalInstance){
    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.intro={
      description:"",
        article_content:""
    };
    $scope.selectedGroups = [];
    IntroService.getAllGroups.query().$promise.then(function(resp){
        $scope.groups=resp;
    });
    $scope.saveIntro=function(){
        console.log($scope.intro);
        var groups_id = [];
        for(var i=0; i<$scope.selectedGroups.length; i++){
            groups_id.push($scope.selectedGroups[i]._id);
        }
        $scope.intro.groupsID = groups_id;
        IntroService.addIntro.save({description: $scope.intro.description,article_content: $scope.intro.article_content, groupsID: $scope.intro.groupsID}).$promise.then(function(resp){
            $scope.statusAlert.newAlert=true;
            $scope.statusAlert.message=resp.message;
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