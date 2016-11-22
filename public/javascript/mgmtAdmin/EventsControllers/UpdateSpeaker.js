controllers.controller('UpdateSpeaker', ['$scope','$rootScope' ,'EventsService', '$state', '$modalInstance', 'AmazonService', 'idToUpdate', 'Success', 'tinyMCEConfig', function($scope, $rootScope, EventsService, $state, $modalInstance, AmazonService, idToUpdate, Success, tinyMCEConfig){

    EventsService.speakers.query({id: idToUpdate}).$promise.then(function (resp) {
        $scope.speaker = Success.getObject(resp);
    });

    $scope.modal = {
        title: "Modifica speaker",
        action: "Modifica"
    };

    var resetAlert = function (type, message) {
        $scope.statusAlert = {
            newAlert:message?true:false,
            type:type,
            message:message
        };
    };

    $scope.fileBody = null;

    $scope.fileSelected = function ($files) {
        if($files[0]){
            $scope.fileBody = $files[0];
        }
    };

    $scope.finalize = function(){
        var speaker = this.speaker;
        console.log(speaker);
        async.waterfall([
            function (callback) {
                //first, delete old image from Amazon
                if($scope.fileBody && speaker.image_path){
                    resetAlert("warning", "Se sterge vechea imagine...");
                    AmazonService.deleteFile(speaker.image_path, function (err, success) {
                        if(err){
                            callback("Eroare la stergerea imaginii vechi de pe Amazon");
                        }else{
                            callback();
                        }
                    });
                }else{
                    callback();
                }
            },
            function (callback) {
                //next, upload new image to Amazon
                if($scope.fileBody){
                    resetAlert("warning", "Se incarca imaginea...");
                    var extension = $scope.fileBody.name.split(".").pop();
                    var key = "speakers/"+speaker._id+"/logo."+extension;
                    AmazonService.uploadFile($scope.fileBody, key, function (err, success) {
                        if(err){
                            callback("Eroare la incarcarea imaginii noi pe Amazon");
                        }else{
                            //update image_path on speaker
                            speaker.image_path = key;
                            callback();
                        }
                    })
                }else{
                    callback();
                }
            },
            function (callback) {
                //now, update speaker
                resetAlert("warning", "Se actualizeaza baza de date...");
                EventsService.speakers.update({id: speaker._id}, speaker).$promise.then(function () {
                    callback();
                }).catch(function () {
                    callback("Eroare la actualizarea bazei de date");
                });
            }
        ], function (err) {
            if(err){
                resetAlert(err);
            }else{
                $state.reload();
                $modalInstance.close();
            }
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.tinymceOptions = tinyMCEConfig.standardConfig();
}]);
