controllers.controller('EditPublicContentCategory', ['$scope', '$state', '$modalInstance', 'publicContentService', 'category', 'Success', 'Error', 'AmazonService', '$rootScope', '$timeout', function ($scope, $state, $modalInstance, publicContentService, category, Success, Error,AmazonService, $rootScope, $timeout) {

    $scope.category = category;

    var resetAlert = function (type, text) {
        $scope.alert = {
            show: text?true:false,
            type: type?type:"danger",
            text: text?text:"Unknown error"
        };
    };

    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
    console.log($scope.category);
    $scope.editCategory = function () {
        console.log(this.category);
        publicContentService.categories.update({id: this.category._id}, this.category).$promise.then(function (resp) {
            resetAlert("success", 'Datele au fost actualizate cu success!');
            $timeout(function(){
                $state.reload();
                $modalInstance.close();
            },3000);
        }).catch(function(err){
            resetAlert("danger", Error.getMessage(err));
        });
    };

    //----------------------------------------------------------------------------------------------------- file upload

    var putFile = function (body, type) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "generalContent/categories/"+$scope.category._id+"/"+type+"/category_"+$scope.category._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    publicContentService.categories.update({data:{id:$scope.category._id, path:key, type: type}}).$promise.then(function (resp) {
                        $scope.uploadAlert.type = "success";
                        $scope.uploadAlert.message = "Upload reusit!";
                        $scope.uploadAlert.newAlert = true;
                        console.log("Upload complete");
                        //update view
                        if(type === "image") $scope.category.image_path = key;
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

    var checkExtension = function (fileBody, arrayAccepted) {
        var extension = fileBody.name.split('.').pop();
        return arrayAccepted.indexOf(extension) != -1;
    };

    $scope.imageSelected = function($files, $event){
        $scope.uploadAlert.newAlert = false;
            //make sure a file was actually loaded
            if($files[0]){
                //check file extension
                if(checkExtension($files[0],["jpg","jpeg","png"])){
                    AmazonService.getClient(function (s3) {
                        var key;
                        //if there already is an image, delete it. Then upload new
                        if($scope.category.image_path){
                            key = $scope.category.image_path;
                            s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                                if(err){
                                    $scope.uploadAlert.type = "danger";
                                    $scope.uploadAlert.message = "Eroare la stergerea imaginii vechi!";
                                    $scope.uploadAlert.newAlert = true;
                                    $scope.$apply();
                                }else{
                                    putFile($files[0], "image");
                                }
                            });
                        }else{
                            putFile($files[0], "image");
                        }
                    });
                }else{
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Fisier nesuportat!";
                    $scope.uploadAlert.newAlert = true;
                }
            }
    };


    $scope.closeModal = function () {
        $modalInstance.close();
    }

}]);