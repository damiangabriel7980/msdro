/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('EditTalk', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){

    EventsAdminService.getAllSpeakers.query().$promise.then(function(resp){
        $scope.speakers=resp;
        EventsAdminService.deleteOrUpdateTalks.getTalk({id:$stateParams.id}).$promise.then(function(respTalk){
            console.log(respTalk);
            $scope.newTalk=respTalk;

            EventsAdminService.getAllConferences.query().$promise.then(function (resp) {
                $scope.conferences = resp;
                $scope.selectedConference = respTalk.conference;
            });
            EventsAdminService.getAllRoom.query().$promise.then(function (resp) {
                $scope.rooms = resp;
                $scope.selectedRoom = respTalk.room;
            });
            $scope.groupSpeakers=[];

            $scope.hour_start=$filter('date')($scope.newTalk.hour_start, 'dd/MMM/yyyy HH:mm:ss');
            $scope.hour_end=$filter('date')($scope.newTalk.hour_end, 'dd/MMM/yyyy HH:mm:ss');

            var listSpeakers = $scope.newTalk.speakers;

            for(var i=0;i<$scope.speakers.length;i++)
            {
                for(var j=0;j<listSpeakers.length;j++)
                {
                    if($scope.speakers[i]._id==listSpeakers[j]._id)
                        $scope.groupSpeakers.push($scope.speakers[i]);
                }
            }
            $scope.selectedSpeaker=$scope.speakers[0];

        });

    });
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
    $scope.updateTalk=function(){
        var id_speakers=[];
        for(var i=0;i<$scope.groupSpeakers.length;i++)
            id_speakers.push($scope.groupSpeakers[i]._id);
        $scope.newTalk.speakers=id_speakers;

        $scope.newTalk.hour_start=new Date($scope.hour_start);
        $scope.newTalk.hour_end=new Date($scope.hour_end);

        $scope.newTalk.room = $scope.selectedRoom._id;
        $scope.newTalk.conference = $scope.selectedConference._id;

        if($scope.newTalk){
            EventsAdminService.deleteOrUpdateTalks.update(
                {id: $stateParams.id}, //url param
                {talk: $scope.newTalk, notification: $scope.notificationCheck?$scope.notificationText:null} //body params
            ).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
        }
    };
    $scope.okk=function(){
        $state.go('content.evenimente');
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
