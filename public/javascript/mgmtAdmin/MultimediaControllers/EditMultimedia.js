/**
 * Created by miricaandrei23 on 18.05.2015.
 */
controllers.controller('EditMultimedia', ['$scope','$rootScope' ,'MultimediaAdminService','GroupsService','$stateParams','$sce','$filter','$modalInstance','$state','therapeuticAreaService','AmazonService','idToEdit', 'Success', 'Error', 'PathologiesService', 'tinyMCEConfig', function($scope,$rootScope,MultimediaAdminService,GroupsService,$stateParams,$sce,$filter,$modalInstance,$state,therapeuticAreaService,AmazonService,idToEdit,Success,Error,PathologiesService, tinyMCEConfig){
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlertVideo = {newAlert:false, type:"", message:""};
    $scope.myAreas = {
        returnedAreas: []
    };
    $scope.myGroups = {
        selectedGroups: null
    };

    $scope.myPathologies = {
        selectedPathologies: null
    };

    $scope.multimedia = {};

    MultimediaAdminService.multimedia.query({id:idToEdit}).$promise.then(function(result){
        $scope.multimedia = Success.getObject(result);
        $scope.selectedAreas = Success.getObject(result)['therapeutic-areasID'];
        $scope.myGroups.selectedGroups = Success.getObject(result)['groupsID'];
        $scope.myPathologies.selectedPathologies = $scope.multimedia.pathologiesID;
        $scope.$applyAsync();
        GroupsService.groups.query().$promise.then(function(resp){
            $scope.groups = Success.getObject(resp);
            PathologiesService.pathologies.query().$promise.then(function(result){
                $scope.pathologies = Success.getObject(result);
            });
        }).catch(function(err){
            $scope.uploadAlert.type = "danger";
            $scope.uploadAlert.message = Error.getMessage(err);
            $scope.uploadAlert.newAlert = true;
        });

        therapeuticAreaService.query().$promise.then(function (resp) {
            $scope.areas = Success.getObject(resp);
        }).catch(function(err){
            $scope.uploadAlert.type = "danger";
            $scope.uploadAlert.message = Error.getMessage(err);
            $scope.uploadAlert.newAlert = true;
        });

    }).catch(function(err){
        $scope.uploadAlert.type = "danger";
        $scope.uploadAlert.message = Error.getMessage(err);
        $scope.uploadAlert.newAlert = true;
    });

    $scope.updateMultimedia = function(){
        var groups_id = [];
        for(var i=0; i<$scope.myGroups.selectedGroups.length; i++){
            groups_id.push($scope.myGroups.selectedGroups[i]._id);
        }
        var id_pathologies = [];
        for(var j=0;j<$scope.myPathologies.selectedPathologies.length;j++){
            id_pathologies.push($scope.myPathologies.selectedPathologies[j]._id);
        }
        $scope.multimedia.pathologiesID = id_pathologies;
        $scope.multimedia.groupsID = groups_id;
        $scope.multimedia['therapeutic-areasID'] = $scope.myAreas.returnedAreas;
        $scope.multimedia.last_updated = new Date();

        MultimediaAdminService.multimedia.update({id:idToEdit},{multimedia: $scope.multimedia}).$promise.then(function (resp) {
            console.log(resp);
            $modalInstance.close();
            $state.go('elearning.multimedia',{},{reload: true});
        }).catch(function(err){
            $scope.uploadAlert.type = "danger";
            $scope.uploadAlert.message = Error.getMessage(err);
            $scope.uploadAlert.newAlert = true;
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
                    MultimediaAdminService.multimedia.update({id:$scope.multimedia._id},{info: {image:key}}).$promise.then(function (resp) {
                            $scope.logo = key;
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Image updated!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                            $scope.multimedia.thumbnail_path = key;
                    }).catch(function(err){
                        $scope.uploadAlert.type = "danger";
                        $scope.uploadAlert.message = Error.getMessage(err);
                        $scope.uploadAlert.newAlert = true;
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
                    MultimediaAdminService.multimedia.update({id:$scope.multimedia._id},{info: {video:key}}).$promise.then(function (resp) {
                            $scope.logo = key;
                            $scope.uploadAlertVideo.type = "success";
                            $scope.uploadAlertVideo.message = "Video updated!";
                            $scope.uploadAlertVideo.newAlert = true;
                            console.log("Upload complete");
                            $scope.multimedia.file_path = key;
                    }).catch(function(err){
                        $scope.uploadAlertVideo.type = "danger";
                        $scope.uploadAlertVideo.message = Error.getMessage(err);
                        $scope.uploadAlertVideo.newAlert = true;
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

    $scope.tinymceOptions = tinyMCEConfig.standardConfig();
}]);