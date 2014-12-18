/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('ConferencesAddCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl){
    EventsAdminService.getAllRoom.query().$promise.then(function(resp){
        $scope.rooms=resp;
        $scope.selectedRoom=$scope.rooms[0];
    });
    $scope.newConference={
        title:  "",
        enable:         "",
        begin_date:        "",
        last_updated: new Date(),
        end_date:"",
        listRooms:$scope.groupRooms,
        qr_code:        {
            message:"",
            conference_id:"",
            type: 2
        },
        description:""
    };
    $scope.groupRooms=[];
    var findRoom = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.groupRooms.length){
            if($scope.groupRooms[i]._id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.RoomWasSelected = function (sel) {
        if(sel._id!=0){

            var index = findRoom(sel._id);
            if(index==-1) $scope.groupRooms.push(sel);

        }
    };

    $scope.removeRoom = function (id) {
        var index = findRoom(id);
        if(index>-1){
            $scope.groupRooms.splice(index,1);
        }
    };
    $scope.newString="";

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
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened1 = true;
    };
    $scope.open2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened2 = true;
    };
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.createConference=function(){
        var id_rooms=[];
        for(var i=0;i<$scope.groupRooms.length;i++)
            id_rooms.push($scope.groupRooms[i]._id);
        $scope.newConference.listRooms=id_rooms;
        $scope.newConference.qr_code.message=$scope.newString;
        console.log($scope.newConference);
        if($scope.newConference){
            EventsAdminService.getAllConferences.save($scope.newConference).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
            console.log($scope.newConference);
            $scope.newConference = {};
        }
    };
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
    $scope.okk=function(){
      $state.go('continut.evenimente');
    };

}]);
