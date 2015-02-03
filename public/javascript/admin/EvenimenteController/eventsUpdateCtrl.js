/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('eventsUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl){

    $scope.notificationCheck = false;

    EventsAdminService.deleteOrUpdateEvents.getEvent({id:$stateParams.id}).$promise.then(function(resp){
        $scope.newEvent=resp;
        $scope.selectedGroups = resp['groupsID'];
        $scope.selectedConferences = resp['listconferences'];
    });

    EventsAdminService.getGroups.query().$promise.then(function(resp){
        $scope.groups=resp;
    });

    EventsAdminService.getAllConferences.query().$promise.then(function(resp){
        $scope.conferences=resp;
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.updateEvent=function() {
        var id_groups = [];
        for (var i = 0; i < $scope.selectedGroups.length; i++)
            id_groups.push($scope.selectedGroups[i]._id);
        var id_confs = [];
        for (var i = 0; i < $scope.selectedConferences.length; i++)
            id_confs.push($scope.selectedConferences[i]._id)

        $scope.newEvent.groupsID = id_groups;
        $scope.newEvent.listconferences = id_confs;

        if($scope.notificationCheck){
            $scope.newEvent.notificationText = $scope.notificationText;
        }

        console.log($scope.newEvent);
        EventsAdminService.deleteOrUpdateEvents.update({id: $stateParams.id}, $scope.newEvent).$promise.then(function(result){
            console.log(result);
            if(result.message)
                growl.addSuccessMessage(result.message);
            else
                growl.addWarnMessage(result);
        });
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
