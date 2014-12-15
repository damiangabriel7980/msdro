/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('talkUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){
    EventsAdminService.getAllSpeakers.query().$promise.then(function(resp){
        $scope.speakers=resp;
        EventsAdminService.deleteOrUpdateTalks.getTalk({id:$stateParams.id}).$promise.then(function(result2){
            $scope.groupSpeakers=[];
            console.log(result2);
            $scope.newTalk=result2;
            $scope.newTalk.hour_start=$filter('date')($scope.newTalk.hour_start, 'dd/MMM/yyyy HH:mm:ss');
            $scope.newTalk.hour_end=$filter('date')($scope.newTalk.hour_end, 'dd/MMM/yyyy HH:mm:ss');
            tinyMCE.activeEditor.setContent($scope.newTalk.description);
            var listSpeakers = $scope.newTalk.listSpeakers;
            var listRooms = $scope.newTalk.listRooms;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    first_name: 'asc'     // initial sorting
                },
                filter: {
                    first_name: ''       // initial filter
                }
            }, {
                total: listSpeakers.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(listSpeakers, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $scope.tableParams2 = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    room_name: 'asc'     // initial sorting
                },
                filter: {
                    room_name: ''       // initial filter
                }
            }, {
                total: listRooms.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(listRooms, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            for(var i=0;i<$scope.speakers.length;i++)
            {
                for(var j=0;j<$scope.newTalk.listSpeakers.length;j++)
                {
                    if($scope.speakers[i]._id==$scope.newTalk.listSpeakers[j]._id)
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
        $scope.newTalk.listSpeakers=id_speakers;
        $scope.date1=new Date($scope.newTalk.hour_start);
        $scope.date2=new Date($scope.newTalk.hour_end);
        //$scope.utc1 = new Date($scope.date1);
        //$scope.utc2 = new Date($scope.date2);
        $scope.newTalk.hour_start=$scope.date1;
        $scope.newTalk.hour_end=$scope.date2;
        $scope.newTalk.last_updated=new Date();
        $scope.newTalk.description=tinyMCE.activeEditor.getContent();
        if($scope.newTalk){
            EventsAdminService.deleteOrUpdateTalks.update({id: $stateParams.id}, $scope.newTalk).$promise.then(function(result){
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
