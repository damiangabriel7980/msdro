controllers.controller('EditEvent', ['$scope', '$state', '$stateParams', 'EventsService', 'GroupsService', 'InfoModal', 'ActionModal', function ($scope, $state, $stateParams, EventsService, GroupsService, InfoModal, ActionModal) {

    var refreshConferences = function () {
        EventsService.conferences.query({event: $scope.event._id}).$promise.then(function (resp) {
            $scope.conferences = resp.success;
            console.log($scope.conferences);
        });
    };

    EventsService.events.query({id: $stateParams.idEvent}).$promise.then(function (resp) {
        $scope.event = resp.success;
        refreshConferences();
    });

    GroupsService.groups.query().$promise.then(function (resp) {
        $scope.allGroups = resp.success;
    });

    $scope.updateEvent = function () {
        var event = this.event;
        if(event.listconferences) delete event.listconferences;
        console.log(event);
        var notification = this.notification || {};
        event.groupsID = this.selectedGroups;
        EventsService.events.update({id: event._id}, event).$promise.then(function (resp) {
            if(resp.error){
                InfoModal.show("Update esuat", "A aparut o eroare la update");
            }else{
                if(notification.send){
                    //TODO: send notification.text
                }else{
                    InfoModal.show("Eveniment actualizat", "Evenimentul a fost actualizat cu succes");
                }
            }
        });
    };

    $scope.editConference = function (id) {
        $state.go('content.events.editConference', {idEvent: $stateParams.idEvent, idConference: id});
    };

    $scope.removeConference = function (id) {
        EventsService.conferences.delete({id: id}).$promise.then(function () {
            refreshConferences();
        });
    };

    $scope.addConference = function () {
        EventsService.conferences.create({title: 'untitled', begin_date: $scope.event.start, end_date: $scope.event.end}).$promise.then(function (createdResponse) {
            if(createdResponse.error){
                InfoModal.show("Creare esuata", "A aparut o eroare la crearea conferintei");
            }else{
                //update event
                EventsService.conferenceToEvent.create({idEvent: $scope.event._id}, {idConference: createdResponse.success._id}).$promise.then(function (resp) {
                    if(resp.error){
                        InfoModal.show("Creare esuata", "A aparut o eroare la crearea conferintei");
                    }else{
                        refreshConferences();
                    }
                });
            }
        })
    }
}]);