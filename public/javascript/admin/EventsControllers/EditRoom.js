controllers.controller('EditRoom', ['$scope', '$rootScope', '$state', '$stateParams', 'EventsService', '$modal', 'InfoModal', 'ActionModal', 'Success', function ($scope, $rootScope, $state, $stateParams, EventsService, $modal, InfoModal, ActionModal, Success) {

    //get room
    EventsService.rooms.query({id: $stateParams.idRoom}).$promise.then(function (resp) {
        $scope.room = Success.getObject(resp);
    });

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

    //=============================================== update room

    $scope.updateRoom = function () {
        var room = this.room;
        console.log(room);
        var notification = this.notification || {};
        EventsService.rooms.update({id: room._id}, room).$promise.then(function () {
            if(notification.send){
                //TODO: send notification.text
            }else{
                InfoModal.show("Camera actualizata", "Camera a fost actualizata cu succes");
            }
        }).catch(function () {
            InfoModal.show("Update esuat", "A aparut o eroare la update");
        });
    };

    $scope.backToEvent = function () {
        $state.go('content.events.editEvent', {idEvent: $stateParams.idEvent});
    }

}]);