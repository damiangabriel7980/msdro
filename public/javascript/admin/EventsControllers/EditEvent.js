controllers.controller('EditEvent', ['$scope', '$state', '$stateParams', 'EventsService', 'GroupsService', 'InfoModal', 'ActionModal', 'AmazonService', 'Success', 'PathologiesService', 'tinyMCEConfig', function ($scope, $state, $stateParams, EventsService, GroupsService, InfoModal, ActionModal, AmazonService, Success, PathologiesService, tinyMCEConfig) {

    var refreshConferences = function () {
        EventsService.conferences.query({event: $stateParams.idEvent}).$promise.then(function (resp) {
            $scope.conferences = Success.getObject(resp);
        });
    };
    refreshConferences();


    $scope.myPathologies = {
        selectedPathologies: null
    };

    var refreshRooms = function () {
        EventsService.rooms.query({event: $stateParams.idEvent}).$promise.then(function (resp) {
            $scope.rooms = Success.getObject(resp);
        });
    };
    refreshRooms();

    EventsService.events.query({id: $stateParams.idEvent}).$promise.then(function (resp) {
        $scope.event = Success.getObject(resp);
        $scope.myPathologies.selectedPathologies = $scope.event.pathologiesID;
    });

    PathologiesService.pathologies.query().$promise.then(function(result){
        $scope.pathologies = Success.getObject(result);
        $scope.$applyAsync();
    });

    GroupsService.groups.query().$promise.then(function (resp) {
        $scope.allGroups = Success.getObject(resp);
    });

    $scope.updateEvent = function () {
        var event = this.event;
        var id_pathologies = [];
        for(var i=0;i<$scope.myPathologies.selectedPathologies.length;i++){
            id_pathologies.push($scope.myPathologies.selectedPathologies[i]._id);
        }
        event.pathologiesID = id_pathologies;
        if(event.listconferences) delete event.listconferences;
        console.log(event);
        var notification = this.notification || {};
        event.groupsID = this.selectedGroups;
        EventsService.events.update({id: event._id}, event).$promise.then(function () {
            if(notification.send){
                //TODO: send notification.text
            }else{
                InfoModal.show("Eveniment actualizat", "Evenimentul a fost actualizat cu succes");
            }
        }).catch(function () {
            InfoModal.show("Update esuat", "A aparut o eroare la update");
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
        },{
            yes: "Da"
        });
    };

    $scope.editRoom = function (id) {
        $state.go('content.events.editRoom', {idEvent: $stateParams.idEvent, idRoom: id});
    };

    $scope.deleteRoom = function (id) {
        ActionModal.show("Stergere camera", "Sunteti sigur ca doriti sa stergeti camera?", function () {
            EventsService.rooms.delete({id: id}).$promise.then(function () {
                refreshRooms();
            }).catch(function () {
                InfoModal.show("Stergere esuata", "A aparut o eroare la stergerea camerei");
            });
        },{
            yes: "Da"
        });
    };

    $scope.addConference = function () {
        EventsService.conferences.create({title: 'untitled', begin_date: $scope.event.start, end_date: $scope.event.end}).$promise.then(function (response) {
            //update event
            EventsService.conferenceToEvent.create({idEvent: $scope.event._id}, {idConference: Success.getObject(response)._id}).$promise.then(function () {
                refreshConferences();
            }).catch(function () {
                InfoModal.show("Creare esuata", "A aparut o eroare la crearea conferintei");
            });
        }).catch(function (err) {
            InfoModal.show("Creare esuata", "A aparut o eroare la crearea conferintei");
        });
    };

    $scope.addRoom = function () {
        EventsService.rooms.create({room_name: 'untitled', event: $scope.event._id}).$promise.then(function () {
            refreshRooms();
        }).catch(function () {
            InfoModal.show("Creare esuata", "A aparut o eroare la crearea camerei");
        });
    };

    $scope.tinymceOptions = tinyMCEConfig.standardConfig();

}]);