controllers.controller('EditGroup', ['$scope','GroupsService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', '$rootScope', function($scope, GroupsService, $modalInstance, $state, idToEdit, AmazonService, $rootScope){

    $scope.fileBody = null;

    var resetAlert = function (type, message) {
        $scope.statusAlert = {
            newAlert:message?true:false,
            type:type,
            message:message
        };
    };
    
    var groupDataLoaded = false;

    GroupsService.groups.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.toUpdate = resp.success;
        GroupsService.users.query().$promise.then(function (resp) {
            $scope.users = resp.success;
            GroupsService.users.query({group: idToEdit}).$promise.then(function (resp) {
                $scope.selectedUsers = resp.success;
                groupDataLoaded = true;
            });
        });
    });

    $scope.editGroup = function () {
        console.log(this);
        var thiz = this;
        async.waterfall([
            function (callback) {
                //upload file s3
                if($scope.fileBody){
                    resetAlert("warning","Se incarca fisierul...");
                    //remove old file
                    AmazonService.deleteFile(thiz.toUpdate.image_path, function (err, success) {
                        if(err){
                            callback("Eroare la stergerea vechiului fisier de pe Amazon");
                        }else{
                            //upload new file
                            var extension = thiz.fileBody.name.split('.').pop();
                            var key = "userGroup/" + thiz.toUpdate._id + "/logo." + extension;
                            AmazonService.uploadFile(thiz.fileBody, key, function (err, success) {
                                if(err){
                                    callback("Eroare la adaugarea noului fisier pe Amazon");
                                }else{
                                    thiz.toUpdate.image_path = key;
                                    callback();
                                }
                            })
                        }
                    });
                }else{
                    callback();
                }
            },
            function (callback) {
                resetAlert("warning","Se actualizeaza datele...");
                //update group
                GroupsService.groups.update({id: thiz.toUpdate._id}, {toUpdate: thiz.toUpdate, users: thiz.newUsers}).$promise.then(function (resp) {
                    if(resp.error){
                        callback("Eroare la update");
                    }else{
                        callback();
                    }
                });
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

    $scope.fileSelected = function($files){
        if($files[0]){
            $scope.fileBody = $files[0];
        }
    };

    $scope.closeModal = function(){
        $state.reload();
        $modalInstance.close();
    }

}]);