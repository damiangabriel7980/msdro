controllers.controller('EditConference', ['$scope', '$rootScope', '$state', '$stateParams', 'EventsService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', function ($scope, $rootScope, $state, $stateParams, EventsService, AmazonService, $modal, InfoModal, ActionModal) {

    //get conference
    EventsService.conferences.query({id: $stateParams.idConference}).$promise.then(function (resp) {
        $scope.conference = resp.success;
        if(resp.success.image_path) setImage(resp.success.image_path);
    });

    //get talks
    var refreshTalks = function () {
        EventsService.talks.query({conference: $stateParams.idConference}).$promise.then(function (resp) {
            $scope.talks = resp.success;
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
                        if(resp.error){
                            uploadAlert("danger", "Eroare la actualizarea imaginii in baza de date");
                        }else{
                            //update model
                            $scope.conference.image_path = key;
                            //update view
                            setImage(key);
                            uploadAlert("success", "Imaginea a fost salvata");
                        }
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
        EventsService.conferences.update({id: conference._id}, conference).$promise.then(function (resp) {
            if(resp.error){
                InfoModal.show("Update esuat", "A aparut o eroare la update");
            }else{
                if(notification.send){
                    //TODO: send notification.text
                }else{
                    InfoModal.show("Conferinta actualizata", "Conferinta a fost actualizata cu succes");
                }
            }
        });
    };

    //============================================== manage talks
    $scope.addTalk = function () {
        EventsService.talks.create({
            title: "untitled",
            hour_start: Date.now(),
            hour_end: Date.now(),
            conference: $stateParams.idConference
        }).$promise.then(function (resp) {
            if(resp.error){
                InfoModal.show("Creare esuata", "A aparut o eroare la crearea talk-ului");
            }else{
                refreshTalks();
            }
        });
    }

}]);