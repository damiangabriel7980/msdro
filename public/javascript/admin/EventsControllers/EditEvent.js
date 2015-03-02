controllers.controller('EditEvent', ['$scope', '$state', '$stateParams', 'EventsService', 'GroupsService', 'InfoModal', 'ActionModal', 'AmazonService', function ($scope, $state, $stateParams, EventsService, GroupsService, InfoModal, ActionModal, AmazonService) {

    var refreshConferences = function () {
        EventsService.conferences.query({event: $stateParams.idEvent}).$promise.then(function (resp) {
            $scope.conferences = resp.success;
        });
    };
    refreshConferences();

    var refreshRooms = function () {
        EventsService.rooms.query({event: $stateParams.idEvent}).$promise.then(function (resp) {
            $scope.rooms = resp.success;
        });
    };
    refreshRooms();

    EventsService.events.query({id: $stateParams.idEvent}).$promise.then(function (resp) {
        $scope.event = resp.success;
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

    $scope.removeConference = function (conference) {
        ActionModal.show("Stergere conferinta", "Sunteti sigur ca doriti sa stergeti conferinta?", function () {
            EventsService.conferences.delete({id: conference._id}).$promise.then(function () {
                //delete image
                AmazonService.deleteFile(conference.image_path, function (err, success) {
                    if(err){
                        console.log(err);
                    }
                    refreshConferences();
                });
            });
        }, "Da");
    };

    $scope.editRoom = function (id) {
        $state.go('content.events.editRoom', {idEvent: $stateParams.idEvent, idRoom: id});
    };

    $scope.deleteRoom = function (id) {
        ActionModal.show("Stergere camera", "Sunteti sigur ca doriti sa stergeti camera?", function () {
            EventsService.rooms.delete({id: id}).$promise.then(function (resp) {
                if(resp.error){
                    InfoModal.show("Stergere esuata", "A aparut o eroare la stergerea camerei");
                }
                refreshRooms();
            });
        }, "Da");
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
    };

    $scope.addRoom = function () {
        EventsService.rooms.create({room_name: 'untitled', event: $scope.event._id}).$promise.then(function (createdResponse) {
            if(createdResponse.error){
                InfoModal.show("Creare esuata", "A aparut o eroare la crearea camerei");
            }else{
                refreshRooms();
            }
        })
    };

}]);