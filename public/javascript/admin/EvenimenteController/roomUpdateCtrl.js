/**
 * Created by miricaandrei23 on 16.12.2014.
 */
cloudAdminControllers.controller('roomUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){

    $scope.roomQr="";

    EventsAdminService.deleteOrUpdateRooms.getRoom({id:$stateParams.id}).$promise.then(function(result){
        $scope.newRoom=result;
        $scope.roomQr=JSON.stringify($scope.newRoom.qr_code);
    });

    $scope.updateRoom=function(){
        if($scope.notificationCheck){
            $scope.newRoom.notificationText = $scope.notificationText;
        }
        if($scope.newRoom){
            EventsAdminService.deleteOrUpdateRooms.update(
                {id: $stateParams.id}, //url params
                {room: $scope.newRoom, notification: $scope.notificationCheck?$scope.notificationText:null} //body params
            ).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
        }
    };

    $scope.okk=function(){
        $state.go('continut.evenimente');
    };

}]);
