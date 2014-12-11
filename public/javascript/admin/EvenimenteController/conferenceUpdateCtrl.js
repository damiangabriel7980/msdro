/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('conferenceUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state){


    EventsAdminService.getAllTalks.query().$promise.then(function(resp){
        $scope.talks=resp;
        for(var i=0;i<$scope.talks.length;i++)
        {
            for(var j=0;j<$scope.newConference.listTalks.length;j++)
            {
                if($scope.talks[i]._id==$scope.newConference.listTalks[j])
                    $scope.groupTalks.push($scope.talks[i]);
            }
        }
        $scope.selectedTalk=$scope.talks[0];
    });

    EventsAdminService.deleteOrUpdateConferences.getConference({id:$stateParams.id}).$promise.then(function(result2){
        $scope.groupTalks=[];
        console.log(result2);
        $scope.newConference=result2;
    });


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
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.updateConference=function(){
        var id_talks=[];
        for(var i=0;i<$scope.groupTalks.length;i++)
            id_talks.push($scope.groupTalks[i]._id);
        $scope.newConference.listTalks=id_talks;
        console.log($scope.newConference);
        if($scope.newConference){
            EventsAdminService.deleteOrUpdateConferences.update({id: $stateParams.id}, $scope.newConference);
            $state.go('continut.evenimente');
        }
    };

    $scope.okk=function(){
        $state.go('continut.evenimente');
    }

}]);
