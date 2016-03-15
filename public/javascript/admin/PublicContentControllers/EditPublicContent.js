controllers.controller('EditPublicContent', ['$scope', '$rootScope', 'publicContentService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', 'Success', 'Error', 'therapeuticAreas', function($scope, $rootScope, publicContentService, $modalInstance, $state, idToEdit, AmazonService, Success, Error, therapeuticAreas){

    $scope.idToEdit = idToEdit;
    var contentDataLoaded = false;

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.contentType = {};
    $scope.myCategories = {};
    $scope.myAreas = {
        selectedAreas: []
    };

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste charmap"
        ],
        height: 500,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    //----------------------------------------------------------------------------------------------------- get content
    publicContentService.publicContent.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.publicContent = Success.getObject(resp);

        $scope.contentType.selectedType = $scope.publicContent.type;

        $scope.myCategories.selectedCategory = Success.getObject(resp).category;

        publicContentService.categories.query().$promise.then(function (resp) {
            if(Success.getObject(resp)){
                $scope.categories = Success.getObject(resp);
            }
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err);
            $scope.statusAlert.newAlert = true;
        });

        contentDataLoaded = true;

        var areasIds = Success.getObject(resp)['therapeutic-areasID']?Success.getObject(resp)['therapeutic-areasID']:[];

        //get therapeutic areas
        therapeuticAreas.areas.query().$promise.then(function (resp) {
            $scope.selectedAreas = areasIds;
            $scope.allAreas = Success.getObject(resp);
        });
    }).catch(function(err){
        $scope.statusAlert.type = "danger";
        $scope.statusAlert.message = Error.getMessage(err);
        $scope.statusAlert.newAlert = true;
    });

    //----------------------------------------------------------------------------------------------------- file upload

    var putFile = function (body, type) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "generalContent/"+idToEdit+"/"+type+"/content_"+idToEdit+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    publicContentService.changeImageOrFile.save({data:{id:idToEdit, path:key, type: type}}).$promise.then(function (resp) {
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Upload reusit!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                            //update view
                            if(type === "image") $scope.publicContent.image_path = key;
                            if(type === "file") $scope.publicContent.file_path = key;
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
        //make sure content data is loaded. we need to access it to form the amazon key
        if(contentDataLoaded){
            //make sure a file was actually loaded
            if($files[0]){
                //check file extension
                if(checkExtension($files[0],["jpg","jpeg","png"])){
                    AmazonService.getClient(function (s3) {
                        var key;
                        //if there already is an image, delete it. Then upload new
                        if($scope.imagePath){
                            key = $scope.imagePath;
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
        }
    };

    $scope.fileSelected = function($files, $event){
        $scope.uploadAlert.newAlert = false;
        //make sure content data is loaded. we need to access it to form the amazon key
        if(contentDataLoaded){
            //make sure a file was actually loaded
            if($files[0]){
                //check file extension
                if(checkExtension($files[0],["pdf","doc","docx","mp4"])){
                    AmazonService.getClient(function (s3) {
                        var key;
                        //if there already is a file, delete it. Then upload new
                        if($scope.filePath){
                            key = $scope.filePath;
                            s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                                if(err){
                                    $scope.uploadAlert.type = "danger";
                                    $scope.uploadAlert.message = "Eroare la stergerea documentului vechi!";
                                    $scope.uploadAlert.newAlert = true;
                                    $scope.$apply();
                                }else{
                                    putFile($files[0], "file");
                                }
                            });
                        }else{
                            putFile($files[0], "file");
                        }
                    });
                }else{
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Fisier nesuportat!";
                    $scope.uploadAlert.newAlert = true;
                }
            }
        }
    };

    //------------------------------------------------------------------------------------------------- form submission

    $scope.editContent = function () {
        $scope.publicContent.type = $scope.contentType.selectedType;
        $scope.publicContent.category = $scope.myCategories.selectedCategory;
        $scope.publicContent['therapeutic-areasID'] = $scope.myAreas.newAreas;
        $scope.publicContent.last_updated = new Date();
        delete $scope.publicContent._id;
        publicContentService.publicContent.update({id: idToEdit},{toUpdate: $scope.publicContent}).$promise.then(function (resp) {
                $scope.statusAlert.type = "success";
                $scope.statusAlert.message = Success.getMessage(resp);
            $scope.statusAlert.newAlert = true;
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err);
            $scope.statusAlert.newAlert = true;
        });
    };

    //------------------------------------------------------------------------------------------------- other functions

    $scope.typeDisplay = function (type) {
        switch(type){
            case 1: return "Stire"; break;
            case 2: return "Articol"; break;
            case 3: return "Elearning"; break;
            case 4: return "Download"; break;
            default: return "Necunoscut"; break;
        }
    };

    $scope.getExtension = function (str) {
        return str.split('.').pop()
    };

    $scope.isMovie = function (str) {
        var ext = $scope.getExtension(str);
        if(ext == "mp4"){
            return true;
        }else{
            return false;
        }
    };

    $scope.closeModal = function(){
        $state.reload();
        $modalInstance.close();
    }

}]);