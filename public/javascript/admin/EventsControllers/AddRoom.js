/**
 * Created by miricaandrei23 on 16.12.2014.
 */
controllers.controller('AddRoom', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){

    $scope.createRoom=function(){
        EventsAdminService.getAllRoom.save({data: $scope.newRoom}).$promise.then(function(result){
            if(result.message)
                growl.addSuccessMessage(result.message);
            else
                growl.addWarnMessage(result);
        });
        console.log($scope.newRoom);
        $scope.newRoom = {};
    };
    $scope.okk=function(){
        $state.go('continut.evenimente');
    };
}]);
