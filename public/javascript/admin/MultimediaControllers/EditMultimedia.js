/**
 * Created by miricaandrei23 on 18.05.2015.
 */
controllers.controller('EditMultimedia', ['$scope','$rootScope' ,'MultimediaAdminService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService','AmazonService','idToEdit', function($scope,$rootScope,MultimediaAdminService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService,AmazonService,idToEdit){
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlertVideo = {newAlert:false, type:"", message:""};

    MultimediaAdminService.deleteOrUpdateMultimedia.getMultimedia({id:idToEdit}).$promise.then(function(result){
        $scope.multimedia=result;
        $scope.selectedAreas = result['therapeutic-areasID'];
        $scope.selectedGroups = result['groupsID'];
    });

    MultimediaAdminService.getAll.query().$promise.then(function(resp){
        $scope.groups = resp['groups'];
    });

    therapeuticAreaService.query().$promise.then(function (resp) {
        $scope.areas = resp;
    });

    $scope.updateMultimedia = function(){
        var groups_id = [];
        for(var i=0; i<$scope.selectedGroups.length; i++){
            groups_id.push($scope.selectedGroups[i]._id);
        }
        $scope.multimedia.groupsID = groups_id;
        $scope.multimedia['therapeutic-areasID'] = $scope.returnedAreas;
        $scope.multimedia.last_updated=new Date();

        MultimediaAdminService.deleteOrUpdateMultimedia.updateMultimedia({id:idToEdit},{multimedia: $scope.multimedia}).$promise.then(function (resp) {
            console.log(resp);
            $modalInstance.close();
            $state.go('elearning.multimedia',{},{reload: true});
        });
    };
    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "multimedia/thumbnails/"+$scope.multimedia._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    MultimediaAdminService.editImage.save({data:{id:$scope.multimedia._id, path:key}}).$promise.then(function (resp) {
                        if(resp.error){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la actualizarea bazei de date!";
                            $scope.uploadAlert.newAlert = true;
                        }else{
                            $scope.logo = key;
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Image updated!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                            $scope.multimedia.thumbnail_path = key;
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
        //make sure a file was actually loaded
        if($files[0]){
            AmazonService.getClient(function (s3) {
                var key;
                //if there already is a logo, delete it. Then upload new
                if($scope.multimedia.thumbnail_path){
                    key=$scope.product.thumbnail_path;
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la stergerea imaginii vechi!";
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

    };
    var putVideoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "multimedia/"+$scope.multimedia._id+"/movie/"+$scope.multimedia._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read',ContentType: body.type}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlertVideo.type = "danger";
                    $scope.uploadAlertVideo.message = "Upload esuat!";
                    $scope.uploadAlertVideo.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    MultimediaAdminService.editVideo.save({data:{id:$scope.multimedia._id, path:key}}).$promise.then(function (resp) {
                        if(resp.error){
                            $scope.uploadAlertVideo.type = "danger";
                            $scope.uploadAlertVideo.message = "Eroare la actualizarea bazei de date!";
                            $scope.uploadAlertVideo.newAlert = true;
                        }else{
                            $scope.logo = key;
                            $scope.uploadAlertVideo.type = "success";
                            $scope.uploadAlertVideo.message = "Video updated!";
                            $scope.uploadAlertVideo.newAlert = true;
                            console.log("Upload complete");
                            $scope.multimedia.file_path = key;
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

    $scope.fileSelectedVideo = function($files, $event){
        //make sure group data is loaded. we need to access it to form the amazon key
        //make sure a file was actually loaded
        if($files[0]){
            AmazonService.getClient(function (s3) {
                var key;
                //if there already is a logo, delete it. Then upload new
                if($scope.multimedia.file_path){
                    key =$scope.multimedia.file_path;
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            $scope.uploadAlertVideo.type = "danger";
                            $scope.uploadAlertVideo.message = "Eroare la stergerea RPC-ului vechi!";
                            $scope.uploadAlertVideo.newAlert = true;
                            $scope.$apply();
                        }else{
                            putVideoS3($files[0]);
                        }
                    });
                }else{
                    putVideoS3($files[0]);
                }
            });
        }

    };
    $scope.closeModal = function () {
        $modalInstance.close();
        $state.go('elearning.multimedia',{},{reload: true});
    };

    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);