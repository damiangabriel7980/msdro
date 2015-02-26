controllers.controller('EditEvent', ['$scope', '$state', '$stateParams', 'EventsService', 'GroupsService', function ($scope, $state, $stateParams, EventsService, GroupsService) {

    EventsService.events.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.event = resp.success;
        $scope.conferences = resp.success.listconferences;
    });

    GroupsService.groups.query().$promise.then(function (resp) {
        $scope.allGroups = resp.success;
    });

    $scope.updateEvent = function () {
        var event = this.event;
        event.groupsID = this.selectedGroups;
        console.log(event);
    };

    $scope.editConference = function (id) {
        //TODO: edit conf
    };

    $scope.removeConference = function (id) {
        //TODO: remove conf
    };

    $scope.addConference = function () {
        //TODO: add conference
    }
}]);