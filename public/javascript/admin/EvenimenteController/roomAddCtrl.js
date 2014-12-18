/**
 * Created by miricaandrei23 on 16.12.2014.
 */
cloudAdminControllers.controller('roomAddCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){
    EventsAdminService.getAllTalks.query().$promise.then(function(resp){
        $scope.talks=resp;
        $scope.selectedTalk=$scope.talks[0];
    });
    EventsAdminService.getAllConferences.query().$promise.then(function(resp){
        $scope.conferences=resp;
        $scope.selectedConference=$scope.conferences[0];
        $scope.newRoom={
            room_name:  "",
            qr_code:        {
                message:"",
                conference_id:"",
                room_id:"",
                type: 1
            },
            id_talks:$scope.groupTalks,
            id_conference:$scope.selectedConference._id
        };
    });

    $scope.newString="";
    $scope.groupTalks=[];
    var findTalk = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.groupTalks.length){
            if($scope.groupTalks[i]._id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.TalkWasSelected = function (sel) {
        if(sel._id!=0){

            var index = findTalk(sel._id);
            if(index==-1) $scope.groupTalks.push(sel);

        }
    };

    $scope.removeTalk = function (id) {
        var index = findTalk(id);
        if(index>-1){
            $scope.groupTalks.splice(index,1);
        }
    };

    $scope.createRoom=function(){
        var id_talks=[];
        for(var i=0;i<$scope.groupTalks.length;i++)
            id_talks.push($scope.groupTalks[i]._id);
        $scope.newRoom.id_talks=id_talks;
        $scope.newRoom.qr_code.message=$scope.newString;
        if($scope.newRoom){
            EventsAdminService.getAllRoom.save($scope.newRoom).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
            console.log($scope.newRoom);
            $scope.newRoom = {};
        }
    };
    $scope.okk=function(){
        $state.go('continut.evenimente');
    };
}]);
