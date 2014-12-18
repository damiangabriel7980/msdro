/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('TalkAddCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl){
    EventsAdminService.getAllSpeakers.query().$promise.then(function(resp){
        $scope.speakers=resp;
        $scope.selectedSpeaker=$scope.speakers[0];
    });
    $scope.newTalk={
        description:  "",
        enable:        "enabled",
        hour_start: "",
        hour_end:        "",
        last_updated: new Date(),
        title:      "",
        place:       "",
        listSpeakers: $scope.groupSpeakers
    };
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
        $scope.newTalk.listSpeakers=id_speakers;

        $scope.utc1 = new Date($scope.newTalk.hour_start);
        $scope.utc2 = new Date($scope.newTalk.hour_end);
        $scope.newTalk.hour_start=$scope.utc1;
        $scope.newTalk.hour_end=$scope.utc2;
        $scope.newTalk.description=tinyMCE.activeEditor.getContent();
        console.log($scope.newTalk);
        if($scope.newTalk){
            EventsAdminService.getAllTalks.save($scope.newTalk).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
            $scope.newTalk = {};
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
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
