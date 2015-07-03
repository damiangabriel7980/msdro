controllers.controller('EditGroup', ['$scope','GroupsService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', '$rootScope', 'Success', 'Error', function($scope, GroupsService, $modalInstance, $state, idToEdit, AmazonService, $rootScope, Success, Error){

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
        $scope.toUpdate = Success.getObject(resp);
        GroupsService.users.query().$promise.then(function (resp) {
            $scope.users = Success.getObject(resp);
            GroupsService.users.query({group: idToEdit}).$promise.then(function (resp) {
                $scope.selectedUsers = Success.getObject(resp);
                groupDataLoaded = true;
            }).catch(function(err){
                resetAlert('danger',Error.getMessage(err));
            });
        }).catch(function(err){
            resetAlert('danger',Error.getMessage(err));
        });
    }).catch(function(err){
        resetAlert('danger',Error.getMessage(err));
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
                        callback();
                }).catch(function(err){
                    callback('Eroare la update');
                    resetAlert('danger',Error.getMessage(err));
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