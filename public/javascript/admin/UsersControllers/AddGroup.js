/**
 * Created by andrei on 25.11.2014.
 */
controllers.controller('AddGroup', ['$scope','GroupsService', '$modalInstance', '$state', 'AmazonService', function($scope, GroupsService, $modalInstance, $state, AmazonService){

    $scope.selectedUsers = [];

    $scope.fileBody = null;

    var resetAlert = function (type, message) {
        $scope.statusAlert = {
            newAlert:message?true:false,
            type:type,
            message:message
        };
    };

    GroupsService.users.query().$promise.then(function (resp) {
        console.log(resp);
        $scope.users = resp.success;
    });

    GroupsService.professions.query().$promise.then(function (resp) {
        $scope.professions = resp.success;
    });

    $scope.fileSelected = function ($files) {
        if($files[0]){
            $scope.fileBody = $files[0];
        }
    };

    $scope.addGroup = function () {
        var thiz = this;
        console.log(this);
        async.waterfall([
            function (callback) {
                //add group
                resetAlert("warning", "Se creaza grupul...");
                GroupsService.groups.create({toCreate: thiz.newGroup, users: thiz.arrayUsers}).$promise.then(function (resp) {
                    if(resp.success){
                        console.log(resp.success);
                        var idAdded = resp.success.created._id;
                        callback(null, idAdded);
                    }else{
                        callback("Eroare la adaugare");
                    }
                });
            },
            function (idAdded, callback) {
                //add file to Amazon
                if(thiz.fileBody){
                    resetAlert("warning", "Se incarca imaginea...");
                    var extension = thiz.fileBody.name.split('.').pop();
                    var key = "userGroup/"+idAdded+"/logo."+extension;
                    AmazonService.uploadFile(thiz.fileBody, key, function (err, success) {
                        if(err){
                            callback("Eroare la salvarea fisierului");
                        }else{
                            //update database
                            GroupsService.groups.update({id: idAdded}, {toUpdate: {image_path: key}}).$promise.then(function (resp) {
                                if(resp.error){
                                    callback("Eroare la update baza de date dupa salvarea imaginii");
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
        $state.reload();
        $modalInstance.close();
    }

}]);