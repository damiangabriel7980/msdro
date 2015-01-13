/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('eventsUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl){
    $scope.notificationCheck = false;

    EventsAdminService.deleteOrUpdateEvents.getEvent({id:$stateParams.id}).$promise.then(function(result2){
        $scope.grupeUser=[];

        $scope.newEvent=result2;
    });

    EventsAdminService.getGroups.query().$promise.then(function(resp){
        $scope.grupuri=resp;

        EventsAdminService.getAllConferences.query().$promise.then(function(resp){
            $scope.conferences=[{title:"Selecteaza o conferinta:",_id:0}];
            $scope.conferences=$scope.conferences.concat(resp);
            $scope.ConfEvents=[];
            for(var i=0;i<$scope.grupuri.length;i++)
            {
                for(var j=0;j<$scope.newEvent.groupsID.length;j++)
                {
                    if($scope.grupuri[i]._id==$scope.newEvent.groupsID[j])
                        $scope.grupeUser.push($scope.grupuri[i]);
                }
            }
            $scope.selectedGroup=$scope.grupuri[0];
            for(var i=0;i<$scope.conferences.length;i++)
            {
                for(var j=0;j<$scope.newEvent.listconferences.length;j++)
                {
                    if($scope.conferences[i]._id==$scope.newEvent.listconferences[j]._id)
                        $scope.ConfEvents.push($scope.conferences[i]);
                }
            }
            $scope.selectedConference=$scope.conferences[0];
            console.log($scope.selectedConference.title);
        });

    });



    $scope.grupeUser=[];
    var findInUserGroup = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.grupeUser.length){
            if($scope.grupeUser[i]._id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.groupWasSelected = function (sel) {
        if(sel._id!=0){

            var index = findInUserGroup(sel._id);
            if(index==-1) $scope.grupeUser.push(sel);

        }
    };

    $scope.removeUserGroup = function (id) {
        var index = findInUserGroup(id);
        if(index>-1){
            $scope.grupeUser.splice(index,1);
        }
    };
    var findInConf = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.ConfEvents.length){
            if($scope.ConfEvents[i]._id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.ConfWasSelected = function (sel) {
        if(sel._id!=0){

            var index = findInConf(sel._id);
            if(index==-1) $scope.ConfEvents.push(sel);

        }
    };

    $scope.removeConf = function (id) {
        var index = findInConf(id);
        if(index>-1){
            $scope.ConfEvents.splice(index,1);
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
    $scope.updateEvent=function() {
        var id_groups = [];
        for (var i = 0; i < $scope.grupeUser.length; i++)
            id_groups.push($scope.grupeUser[i]._id);
        var id_confs = [];
        for (var i = 0; i < $scope.ConfEvents.length; i++)
            id_confs.push($scope.ConfEvents[i]._id)
        $scope.newEvent.groupsID = id_groups;
        $scope.newEvent.listconferences = id_confs;
        if($scope.notificationCheck){
            $scope.newEvent.notificationText = $scope.notificationText;
        }
        console.log($scope.newEvent);
        if ($scope.newEvent) {
            EventsAdminService.deleteOrUpdateEvents.update({id: $stateParams.id}, $scope.newEvent).$promise.then(function(result){
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
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
