controllers.controller('CreateSpeaker', ['$scope','$rootScope' ,'EventsService', '$state', '$modalInstance', 'AmazonService', function($scope, $rootScope, EventsService, $state, $modalInstance, AmazonService){

    $scope.modal = {
        title: "Adauga speaker",
        action: "Adauga"
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
        async.waterfall([
            function (callback) {
                resetAlert("warning", "Se adauga in baza de date...");
                //first, add speaker to database
                EventsService.speakers.create(speaker).$promise.then(function (resp) {
                    if(resp.error){
                        callback("Eroare la crearea speaker-ului");
                    }else{
                        callback(null, resp.success._id); //send created id in callback
                    }
                });
            },
            function (idCreated, callback) {
                //add image to Amazon
                if($scope.fileBody){
                    resetAlert("warning", "Se incarca imaginea...");
                    var extension = $scope.fileBody.name.split('.').pop();
                    var key = "speakers/"+idCreated+"/logo."+extension;
                    AmazonService.uploadFile($scope.fileBody, key, function (err, success) {
                        if(err){
                            callback("Eroare la incarcarea pozei");
                        }else{
                            //update database
                            EventsService.speakers.update({id: idCreated}, {image_path: key}).$promise.then(function (resp) {
                                if(resp.error){
                                    callback("Eroare la adaugarea imaginii in baza de date");
                                }else{
                                    callback();
                                }
                            });
                        }
                    });
                }else{
                    callback();
                }
            }
        ], function (err) {
            if(err){
                resetAlert("danger", err);
            }else{
                $state.reload();
                $modalInstance.close();
            }
        });
    };

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
