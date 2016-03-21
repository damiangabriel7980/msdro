/**
 * Created by miricaandrei23 on 27.11.2014.
 */
controllers.controller('EditArticles', ['$scope','$rootScope' ,'ContentService','$modalInstance','$state','AmazonService', 'idToEdit', 'GroupsService', 'Success', 'Error', function($scope,$rootScope,ContentService,$modalInstance,$state,AmazonService,idToEdit,GroupsService,Success,Error){

    $scope.myGroups = {
        selectedGroups: []
    };
    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        image_advtab: true,
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlertImages = {newAlert:false, type:"", message:""};

    ContentService.content.query({id: idToEdit}).$promise.then(function(response){
        $scope.article = Success.getObject(response);
        $scope.imagePath = $rootScope.pathAmazonDev+Success.getObject(response).image_path;

        var userGroups = Success.getObject(response).groupsID;

        ContentService.groupsByIds.query({ids: userGroups}).$promise.then(function (groups) {
            $scope.myGroups.selectedGroups = Success.getObject(groups);
            GroupsService.groups.query().$promise.then(function(resp){
                $scope.groups = Success.getObject(resp);
            }).catch(function(err){
                $scope.statusAlert.type = "danger";
                $scope.statusAlert.message = Error.getMessage(err);
                $scope.statusAlert.newAlert = true;
            });
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err);
            $scope.statusAlert.newAlert = true;
        });

    }).catch(function(err){
        $scope.statusAlert.type = "danger";
        $scope.statusAlert.message = Error.getMessage(err);
        $scope.statusAlert.newAlert = true;
    });

    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "content/"+$scope.article._id+"/article-logo/logo"+$scope.article._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    ContentService.content.update({id:$scope.article._id},{info:{image:key}}).$promise.then(function (resp) {
                            $scope.logo = key;
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Logo updated!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                            $scope.imagePath = $rootScope.pathAmazonDev+key;
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
                    if($scope.article.image_path){
                        key =$scope.article.image_path;
                        s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                            if(err){
                                $scope.uploadAlert.type = "danger";
                                $scope.uploadAlert.message = "Eroare la stergerea pozei vechi!";
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
    $scope.removeImage=function(image){
        var indexDelete = $scope.article.associated_images.indexOf(image);
        if(indexDelete > -1)
        {
            AmazonService.getClient(function (s3) {
                $scope.article.associated_images.splice(indexDelete, 1);
                var key="";
                //if there already is a logo, delete it. Then upload new
                if($scope.article.associated_images){
                    key =image;
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la stergerea elementului multimedia vechi!";
                            $scope.uploadAlert.newAlert = true;
                            $scope.$apply();
                        }else{
                            ContentService.content.update({id:$scope.article._id}, {info:{associated_images:$scope.article.associated_images}}).$promise.then(function (resp) {
                                    $scope.logo = key;
                                    $scope.uploadAlertImages.type = "success";
                                    $scope.uploadAlertImages.message = "Multimedia for articles updated!";
                                    $scope.uploadAlertImages.newAlert = true;
                                    console.log("Upload complete");
                            }).catch(function(err){
                                $scope.uploadAlertImages.type = "danger";
                                $scope.uploadAlertImages.message = Error.getMessage(err);
                                $scope.uploadAlertImages.newAlert = true;
                            });
                        }
                    });
                }
            });

        }
    };

    var putAssociatedImagesS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var filename = body.name.split('.').shift();
            var key = "content/"+$scope.article._id+"/article_images/"+filename+"."+extension;
            if($scope.article.associated_images)
            {
                for(var i=0;i<$scope.article.associated_images.length;i++)
                {
                    if($scope.article.associated_images[i]==key)
                    {
                        filename+='1';
                        key = "content/"+$scope.article._id+"/article_images/"+filename+"."+extension;
                        i=0;
                    }
                }
                $scope.article.associated_images.push(key);
                var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                    if (err) {
                        console.log(err);
                        $scope.uploadAlertImages.type = "danger";
                        $scope.uploadAlertImages.message = "Upload esuat!";
                        $scope.uploadAlertImages.newAlert = true;
                        $scope.$apply();
                    } else {
                        //update database as well
                        ContentService.content.update({id:$scope.article._id}, {info:{associated_images:$scope.article.associated_images}}).$promise.then(function (resp) {
                                $scope.logo = key;
                                $scope.uploadAlertImages.type = "success";
                                $scope.uploadAlertImages.message = "Multimedia for articles updated!";
                                $scope.uploadAlertImages.newAlert = true;
                                console.log("Upload complete");
                        }).catch(function(err){
                            $scope.uploadAlertImages.type = "danger";
                            $scope.uploadAlertImages.message = Error.getMessage(err);
                            $scope.uploadAlertImages.newAlert = true;
                        });
                    }
                });
                req.on('httpUploadProgress', function (evt) {
                    var progress = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.$apply(function() {
                        console.log(progress);
                    })
                });
            }
            else
            {
                $scope.article.associated_images.push(key);
                var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                    if (err) {
                        console.log(err);
                        $scope.uploadAlertImages.type = "danger";
                        $scope.uploadAlertImages.message = "Upload esuat!";
                        $scope.uploadAlertImages.newAlert = true;
                        $scope.$apply();
                    } else {
                        //update database as well
                        ContentService.content.update({id:$scope.article._id}, {info:{associated_images:$scope.article.associated_images}}).$promise.then(function (resp) {
                                $scope.logo = key;
                                $scope.uploadAlertImages.type = "success";
                                $scope.uploadAlertImages.message = "Multimedia for articles updated!";
                                $scope.uploadAlertImages.newAlert = true;
                                console.log("Upload complete");
                        }).catch(function(err){
                            $scope.uploadAlertImages.type = "danger";
                            $scope.uploadAlertImages.message = Error.getMessage(err);
                            $scope.uploadAlertImages.newAlert = true;
                        });
                    }
                });
                req.on('httpUploadProgress', function (evt) {
                    var progress = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.$apply(function() {
                        console.log(progress);
                    })
                });
            }

        });
    };

    $scope.fileAssociatedSelected = function($files, $event){
        //make sure group data is loaded. we need to access it to form the amazon key
        //make sure a file was actually loaded
        if($files[0]){
            AmazonService.getClient(function (s3) {
                putAssociatedImagesS3($files[0]);
            });
        }

    };


    $scope.updateArticle=function(){
        var id_groups=[];
        for(var i=0;i<$scope.myGroups.selectedGroups.length;i++){
            id_groups.push($scope.myGroups.selectedGroups[i]._id);
        }
        $scope.article.groupsID=id_groups;
        $scope.article.last_updated = Date.now();
        ContentService.content.update({id: idToEdit},{article:$scope.article}).$promise.then(function (resp) {
            $scope.closeModal();
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err);
            $scope.statusAlert.newAlert = true;
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
        $state.go('content.articles',{},{reload: true});
    };
}]);
