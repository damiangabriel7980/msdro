controllers.controller('EditTalk', ['$scope', '$rootScope', '$state', '$stateParams', 'EventsService', '$modal', 'InfoModal', 'ActionModal', function ($scope, $rootScope, $state, $stateParams, EventsService, $modal, InfoModal, ActionModal) {

    //get talk
    EventsService.talks.query({id: $stateParams.idTalk}).$promise.then(function (resp) {
        $scope.talk = resp.success;
        $scope.selectedSpeakers = resp.success.speakers || [];
    });

    //get speakers
    EventsService.speakers.query().$promise.then(function (resp) {
        $scope.speakers = resp.success;
    });

    //get rooms
    EventsService.rooms.query({event: $stateParams.idEvent}).$promise.then(function (resp) {
        $scope.rooms = resp.success;
    });

    //set types
    $scope.types = [
        {number: 1, name: "Talk"},
        {number: 2, name: "Pauza"}
    ];

    //=============================================== update talk

    $scope.updateTalk = function () {
        var talk = this.talk;
        talk.speakers = getIds($scope.selectedSpeakers);
        console.log(talk);
        var notification = this.notification || {};
        EventsService.talks.update({id: talk._id}, talk).$promise.then(function (resp) {
            if(resp.error){
                InfoModal.show("Update esuat", "A aparut o eroare la update");
            }else{
                if(notification.send){
                    //TODO: send notification.text
                }else{
                    InfoModal.show("Talk actualizat", "Talk-ul a fost actualizat cu succes");
                }
            }
        });
    };

    //============================================== manage speakers
    var findSpeaker = function (arraySpeakers, toFind) {
        for(var i=0; i<arraySpeakers.length; i++){
            if(toFind._id == arraySpeakers[i]._id){
                return i;
            }
        }
        return -1;
    };

    var getIds = function (documents) {
        var ids = [];
        for(var i=0; i<documents.length; i++){
            ids.push(documents[i]._id);
        }
        return ids;
    };

    $scope.selectSpeaker = function () {
        if(findSpeaker($scope.selectedSpeakers, $scope.selectedSpeaker) == -1){
            $scope.selectedSpeakers.push($scope.selectedSpeaker);
        }
    };
    $scope.removeSpeaker = function (speaker) {
        var index = findSpeaker($scope.selectedSpeakers, speaker);
        $scope.selectedSpeakers.splice(index, 1);
    }

}]);