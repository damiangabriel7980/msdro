/**
 * Created by miricaandrei23 on 27.02.2015.
 */
controllers.controller('IntroDetails', ['$scope','$rootScope' ,'IntroService','$stateParams','$sce','$filter','$state','idToView','$modalInstance','GroupsService', 'Success', 'Error', 'tinyMCEConfig', function($scope,$rootScope,IntroService,$stateParams,$sce,$filter,$state,idToView,$modalInstance,GroupsService,Success,Error, tinyMCEConfig){
    $scope.intro = {};

    IntroService.intros.query({id: idToView}).$promise.then(function(resp){
        $scope.intro = Success.getObject(resp)['onePresentation'];
        $scope.selectedGroups = $scope.intro['groupsID'];
        $scope.$applyAsync();
    }).catch(function(err){
        $scope.statusAlert.type = "danger";
        $scope.statusAlert.message = Error.getMessage(err);
        $scope.statusAlert.newAlert = true;
    });

    GroupsService.groups.query().$promise.then(function(resp){
        $scope.groups = Success.getObject(resp);
    }).catch(function(err){
        $scope.statusAlert.type = "danger";
        $scope.statusAlert.message = Error.getMessage(err);
        $scope.statusAlert.newAlert = true;
    });

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    $scope.saveIntro=function(){
        var groups_id = [];
        for(var i=0; i<$scope.selectedGroups.length; i++){
            groups_id.push($scope.selectedGroups[i]._id);
        }
        $scope.intro.groupsID = groups_id;
        IntroService.intros.update({id: idToView},{intro: $scope.intro}).$promise.then(function(resp){
            $scope.statusAlert.newAlert = true;
            $scope.statusAlert.message = Success.getMessage(resp);
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err);
            $scope.statusAlert.newAlert = true;
        });
    };
    $scope.tinymceOptions = tinyMCEConfig.standardConfig();
    $scope.closeModal=function(){
      $modalInstance.close();
        $state.reload();
    };
}]);