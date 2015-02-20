controllers.controller('EditGroup', ['$scope','GroupsService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', '$rootScope', function($scope, GroupsService, $modalInstance, $state, idToEdit, AmazonService, $rootScope){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    
    var groupDataLoaded = false;

    GroupsService.groupDetails.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.nume = resp.display_name;
        $scope.descriere = resp.description;
        $scope.grupDefault = resp.default_group?(resp.default_group==1):false;
        $scope.contentSpecific = resp.content_specific?resp.content_specific:false;
        $scope.logo = resp.image_path;
        $scope.idGroup = resp._id;
        $scope.profession = resp.profession.display_name;
        GroupsService.getAllUsers.query().$promise.then(function (resp) {
            $scope.users = resp;
            GroupsService.getAllUsersByGroup.query({id: idToEdit}).$promise.then(function (resp) {
                $scope.selectedUsers = resp;
                groupDataLoaded = true;
            });
        });
    });

    $scope.editGroup = function () {
        console.log(this);
        console.log($scope.selectedUsers);
        var toSend = {group:{},users:{}, edit: true};
        toSend.id = idToEdit;
        toSend.group.display_name = this.nume;
        toSend.group.description = this.descriere;
        toSend.group.default_group = this.grupDefault?1:0;
        toSend.group.content_specific = this.contentSpecific?true:false;
        toSend.users = this.selectedUsers;
        GroupsService.editGroup.save({data: toSend}).$promise.then(function (resp) {
            $scope.statusAlert.message = resp.message;
            if(resp.error){
                $scope.statusAlert.type = "danger";
            }else{
                $scope.statusAlert.type = "success";
            }
            $scope.statusAlert.newAlert = true;
        });
    };

    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "userGroup/"+$scope.idGroup+"/image-logo/logo"+$scope.idGroup+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    GroupsService.changeGroupLogo.save({data:{id:$scope.idGroup, path:key}}).$promise.then(function (resp) {
                        if(resp.error){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la actualizarea bazei de date!";
                            $scope.uploadAlert.newAlert = true;
                        }else{
                            $scope.logo = key;
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Logo updated!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                        }
                    });
                }
            });
            req.on('httpUploadProgress', function (evt) {
                var progress = parseInt(100.0 * evt.loaded / evt.total);
                $scope.$apply(function() {
                    console.log(progress);
                })
            });
        });
    };

    $scope.fileSelected = function($files, $event){
        //make sure group data is loaded. we need to access it to form the amazon key
        if(groupDataLoaded){
            //make sure a file was actually loaded
            if($files[0]){
                AmazonService.getClient(function (s3) {
                    var key;
                    //if there already is a logo, delete it. Then upload new
                    if($scope.logo){
                        key = $scope.logo;
                        s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                            if(err){
                                $scope.uploadAlert.type = "danger";
                                $scope.uploadAlert.message = "Eroare la stergerea logo-ului vechi!";
                                $scope.uploadAlert.newAlert = true;
                                $scope.$apply();
                            }else{
                                putLogoS3($files[0]);
                            }
                        });
                    }else{
                        putLogoS3($files[0]);
                    }
                });
            }
        }
    };

    $scope.closeModal = function(){
        $state.reload();
        $modalInstance.close();
    }

}]);