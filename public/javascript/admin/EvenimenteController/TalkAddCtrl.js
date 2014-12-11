/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('TalkAddCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter){
    EventsAdminService.getGroups.query().$promise.then(function(resp){
        $scope.grupuri=resp;
        EventsAdminService.getAllConferences.query().$promise.then(function(resp){
            $scope.conferences=resp;
            $scope.selectedConference=$scope.conferences[0];
            $scope.selectedGroup=$scope.grupuri[0];
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
    $scope.ConfEvents=[];
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
