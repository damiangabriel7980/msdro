controllers.controller('EditConference', ['$scope', '$state', '$stateParams', 'EventsService', 'InfoModal', 'ActionModal', function ($scope, $state, $stateParams, EventsService, InfoModal, ActionModal) {

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
    $scope.scanQr = function () {
        //TODO: open modal
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

    //file selected function
    $scope.fileSelected = function ($files) {
        //TODO: upload image
        if($files[0]){
            var file = $files[0];
            uploadAlert("warning", "Se incarca imaginea...");
        }
    };

    //=============================================== update conference

    $scope.updateConference = function () {
        var conference = this.conference;
        console.log(conference);
        var notification = this.notification || {};
    }

}]);