/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('conferenceUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){


    EventsAdminService.getAllRoom.query().$promise.then(function(resp){
        $scope.rooms=resp;
        EventsAdminService.deleteOrUpdateConferences.getConference({id:$stateParams.id}).$promise.then(function(result2){

            $scope.newConference=result2;
            $scope.string=JSON.stringify($scope.newConference.qr_code);
            $scope.groupRooms=[];
            for(var i=0;i<$scope.rooms.length;i++)
            {
                for(var j=0;j<$scope.newConference.listRooms.length;j++)
                {
                    if($scope.rooms[i]._id==$scope.newConference.listRooms[j]._id)
                        $scope.groupRooms.push($scope.rooms[i]);
                }
            };
            $scope.selectedRoom=$scope.rooms[0];
            console.log(result2);
            $scope.newString=$scope.newConference.qr_code.message;
            var listRooms = $scope.newConference.listRooms;
            $scope.tableParams = new ngTableParams({
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

        });


    });
    $scope.newString="";
    $scope.messageString="";


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

    $scope.updateConference=function(){
        var id_rooms=[];
        for(var i=0;i<$scope.groupRooms.length;i++)
            id_rooms.push($scope.groupRooms[i]._id);
        $scope.newConference.listRooms=id_rooms;
        $scope.utc1 = new Date($scope.newConference.begin_date);
        $scope.utc2 = new Date($scope.newConference.end_date);
        $scope.newConference.begin_date=$scope.utc1;
        $scope.newConference.end_date=$scope.utc2;
        console.log($scope.newConference);
        if($scope.newConference){
            EventsAdminService.deleteOrUpdateConferences.update({id: $stateParams.id}, $scope.newConference).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
        }
    };

    $scope.okk=function(){
        $state.go('continut.evenimente');
    }
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}])
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });

