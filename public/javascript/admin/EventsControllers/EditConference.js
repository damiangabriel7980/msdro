controllers.controller('EditConference', ['$scope', '$rootScope', '$state', '$stateParams', 'EventsService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', function ($scope, $rootScope, $state, $stateParams, EventsService, AmazonService, $modal, InfoModal, ActionModal, Success) {

    //get conference
    EventsService.conferences.query({id: $stateParams.idConference}).$promise.then(function (resp) {
        var conference = Success.getObject(resp);
        $scope.conference = conference;
        if(conference.image_path) setImage(conference.image_path);
    });

    //get talks
    var refreshTalks = function () {
        EventsService.talks.query({conference: $stateParams.idConference}).$promise.then(function (resp) {
            $scope.talks = Success.getObject(resp);
        });
    };
    refreshTalks();

    //=============================================== functions and variables for date pop-ups
    $scope.dateFormat = 'dd.MM.yyyy';

    $scope.isOpenedStart = false;
    $scope.isOpenedEnd = false;

    $scope.open_start = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.isOpenedStart = true;
    };
    $scope.open_end = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.isOpenedEnd = true;
    };
    //=========

    //============================================== QR functions
    $scope.scanQr = function (qr_code) {
        $modal.open({
            templateUrl: 'partials/admin/content/events/modalGenerateQR.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'ModalGenerateQR',
            resolve: {
                qrObject: function () {
                    return qr_code;
                }
            }
        });
    };

    //============================================== Image upload function

    //upload alert
    var uploadAlert = function (type, text) {
        $scope.uploadAlert = {
            type: type?type:"danger",
            text: text?text:"Unknown error",
            show: text?true:false
        };
    };

    //set image with disabled cache
    var setImage = function (key) {
        $scope.conferenceImage = $rootScope.pathAmazonDev + key + '?' + new Date().getTime();
    };

    //file selected function
    $scope.fileSelected = function ($files) {
        //TODO: upload image
        if($files[0]){
            var file = $files[0];
            uploadAlert("warning", "Se incarca imaginea...");
            var extension = file.name.split(".").pop();
            var key = "conferences/"+$scope.conference._id+"/logo."+extension;
            AmazonService.uploadFile(file, key, function (err, success) {
                if(err){
                    uploadAlert("danger", "Eroare la incarcarea fisierului");
                }else{
                    //update database
                    EventsService.conferences.update({id: $scope.conference._id}, {image_path: key}).$promise.then(function (resp) {
                        //update model
                        $scope.conference.image_path = key;
                        //update view
                        setImage(key);
                        uploadAlert("success", "Imaginea a fost salvata");
                    }).catch(function () {
                        uploadAlert("danger", "Eroare la actualizarea imaginii in baza de date");
                    });
                }
            });
        }
    };

    //=============================================== update conference

    $scope.updateConference = function () {
        var conference = this.conference;
        //make sure we don't record an older image path
        if(conference.image_path) delete conference.image_path;
        console.log(conference);
        var notification = this.notification || {};
        EventsService.conferences.update({id: conference._id}, conference).$promise.then(function () {
            if(notification.send){
                //TODO: send notification.text
            }else{
                InfoModal.show("Conferinta actualizata", "Conferinta a fost actualizata cu succes");
            }
        }).catch(function () {
            InfoModal.show("Update esuat", "A aparut o eroare la update");
        });
    };

    //============================================== manage talks
    $scope.addTalk = function () {
        EventsService.talks.create({
            title: "untitled",
            conference: $stateParams.idConference
        }).$promise.then(function (resp) {
                refreshTalks();
        }).catch(function () {
                InfoModal.show("Creare esuata", "A aparut o eroare la crearea talk-ului");
            });
    };

    $scope.removeTalk = function (id) {
        ActionModal.show("Stergere talk", "Sunteti sigur ca doriti sa stergeti talk-ul?", function () {
            EventsService.talks.delete({id: id}).$promise.then(function (resp) {
                refreshTalks();
            }).catch(function () {
                InfoModal.show("Stergere esuata", "A aparut o eroare la stergerea talk-ului");
            });
        },{
            yes: "Da"
        });
    };

    $scope.editTalk = function (id) {
        $state.go('content.events.editTalk', {idEvent: $stateParams.idEvent, idConference: $stateParams.idConference, idTalk: id});
    };

    $scope.getLocalTime = function (dateStr) {
        var date = new Date(dateStr);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(hours < 10) hours = "0"+hours;
        if(minutes < 10) minutes = "0"+minutes;
        return hours+":"+minutes;
    };

    $scope.backToEvent = function () {
        $state.go('content.events.editEvent', {idEvent: $stateParams.idEvent});
    };

}]);