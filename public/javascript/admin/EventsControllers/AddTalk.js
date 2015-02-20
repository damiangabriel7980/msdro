/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('AddTalk', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl){
    EventsAdminService.getAllSpeakers.query().$promise.then(function(resp){
        $scope.speakers=resp;
        $scope.selectedSpeaker=$scope.speakers[0];
    });
    EventsAdminService.getAllConferences.query().$promise.then(function (resp) {
        $scope.conferences = resp;
        $scope.selectedConference = resp[0];
    });
    EventsAdminService.getAllRoom.query().$promise.then(function (resp) {
        $scope.rooms = resp;
        $scope.selectedRoom = resp[0];
    });

    $scope.groupSpeakers=[];

    var findSpeaker = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.groupSpeakers.length){
            if($scope.groupSpeakers[i]._id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.SpeakerWasSelected = function (sel) {
        if(sel._id!=0){

            var index = findSpeaker(sel._id);
            if(index==-1) $scope.groupSpeakers.push(sel);

        }
    };

    $scope.removeSpeaker = function (id) {
        var index = findSpeaker(id);
        if(index>-1){
            $scope.groupSpeakers.splice(index,1);
        }
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.createTalk=function(){
        var id_speakers=[];
        for(var i=0;i<$scope.groupSpeakers.length;i++)
            id_speakers.push($scope.groupSpeakers[i]._id);
        $scope.newTalk.speakers=id_speakers;

        $scope.newTalk.hour_start=new Date($scope.hour_start);
        $scope.newTalk.hour_end=new Date($scope.hour_end);

        $scope.newTalk.conference = $scope.selectedConference._id;
        $scope.newTalk.room = $scope.selectedRoom._id;

        console.log($scope.newTalk);
        if($scope.newTalk){
            EventsAdminService.getAllTalks.save({data: $scope.newTalk}).$promise.then(function(result){
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
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
