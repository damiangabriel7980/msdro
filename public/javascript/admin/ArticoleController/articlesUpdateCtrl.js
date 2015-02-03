/**
 * Created by miricaandrei23 on 27.11.2014.
 */
cloudAdminControllers.controller('articlesUpdateCtrl', ['$scope','$rootScope' ,'ContentService','$modalInstance','$state','AmazonService', 'idToEdit', function($scope,$rootScope,ContentService,$modalInstance,$state,AmazonService,idToEdit){

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    ContentService.deleteOrUpdateContent.getContent({id: idToEdit}).$promise.then(function(response){
        $scope.article = response;
        $scope.imagePath = $rootScope.pathAmazonDev+response.image_path;

        var userGroups = response.groupsID;

        ContentService.getGroupsByIds.query({ids: userGroups}).$promise.then(function (groups) {
            $scope.selectedGroups = groups;
        });

    });

    ContentService.getAll.query().$promise.then(function(result) {
        $scope.groups = result['groups'];
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
                    ContentService.editImage.save({data:{id:$scope.article._id, path:key}}).$promise.then(function (resp) {
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
                            $scope.imagePath = $rootScope.pathAmazonDev+key;
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

    $scope.updateArticle=function(){
        var id_groups=[];
        for(var i=0;i<$scope.selectedGroups.length;i++){
            id_groups.push($scope.selectedGroups[i]._id);
        }

        $scope.article.groupsID=id_groups;

        ContentService.deleteOrUpdateContent.update({id: idToEdit},$scope.article).$promise.then(function (resp) {
            console.log(resp);
            $state.reload();
            $modalInstance.close();
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
    };
}]);
