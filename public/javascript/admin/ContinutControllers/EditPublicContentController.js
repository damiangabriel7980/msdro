cloudAdminControllers.controller('EditPublicContentController', ['$scope', '$rootScope', 'publicContentService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', function($scope, $rootScope, publicContentService, $modalInstance, $state, idToEdit, AmazonService){

    var contentDataLoaded = false;

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    $scope.tinymceOptions = {
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

    //get content by id
    publicContentService.getContentById.query({id: idToEdit}).$promise.then(function (resp) {
        console.log(resp);
        $scope.titlu = resp.title;
        $scope.autor = resp.author;
        $scope.descriere = resp.description;
        $scope.selectedType = resp.type;
        $scope.contentText = resp.text;
        $scope.imagePath = resp.image_path;
        $scope.filePath = resp.file_path;

        contentDataLoaded = true;

        var areasIds = resp['therapeutic-areasID']?resp['therapeutic-areasID']:[];

        //get therapeutic areas
        publicContentService.getTherapeuticAreas.query().$promise.then(function (resp) {
            var areasOrganised = [];
            areasOrganised.push({id:0, name:"Adauga arii terapeutice"});
            areasOrganised.push({id:1, name:"Toate"});
            for(var i=0; i<resp.length; i++){
                var thisArea = resp[i];
                if(thisArea['therapeutic-areasID'].length == 0){
                    //it's a parent. Add it
                    areasOrganised.push({id: thisArea._id, name:thisArea.name});
                    if(thisArea.has_children){
                        //find all it's children
                        for(var j=0; j < resp.length; j++){
                            if(resp[j]['therapeutic-areasID'].indexOf(thisArea._id)>-1){
                                //found one children. Add it
                                areasOrganised.push({id: resp[j]._id, name:"0"+resp[j].name});
                            }
                        }
                    }
                }
            }
            $scope.allAreas = areasOrganised;
            $scope.selectedArea = $scope.allAreas[0];

            //format selected therapeutic areas

            var formattedAreas = [];
            for(var k=0; k<areasIds.length; k++){
                var area = findInFormattedAreas(areasIds[k]);
                if(area) formattedAreas.push(area);
            }
            $scope.selectedTherapeuticAreas = formattedAreas;
        });
    });

    //--------------------------------------------------------------------------------- functions for therapeutic areas

    var findInFormattedAreas = function (id) {
        var i=2;
        while(i<$scope.allAreas.length){
            if($scope.allAreas[i].id==id){
                return {id: $scope.allAreas[i].id, name: $scope.allAreas[i].name};
            }
            i++;
        }
        return null;
    };

    var findInUserAreas = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.selectedTherapeuticAreas.length){
            if($scope.selectedTherapeuticAreas[i].id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.areaWasSelected = function (sel) {
        if(sel.id!=0){
            if(sel.id==1){
                $scope.selectedTherapeuticAreas = [];
                for(var i=2; i<$scope.allAreas.length; i++){
                    $scope.selectedTherapeuticAreas.push($scope.allAreas[i]);
                }
            }else{
                var index = findInUserAreas(sel.id);
                if(index==-1) $scope.selectedTherapeuticAreas.push(sel);
            }
        }
    };
    $scope.removeUserArea = function (id) {
        var index = findInUserAreas(id);
        if(index>-1){
            $scope.selectedTherapeuticAreas.splice(index,1);
        }
    };

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
                        if(resp.error){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la actualizarea bazei de date!";
                            $scope.uploadAlert.newAlert = true;
                        }else{
                            $scope.uploadAlert.type = "success";
                            $scope.uploadAlert.message = "Upload reusit!";
                            $scope.uploadAlert.newAlert = true;
                            console.log("Upload complete");
                            //update view
                            if(type === "image") $scope.imagePath = key;
                            if(type === "file") $scope.filePath = key;
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
                if(checkExtension($files[0],["pdf","doc","docx"])){
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
        var toUpdate = {};
        toUpdate.title = this.titlu?this.titlu:"";
        toUpdate.author = this.autor?this.autor:"";
        toUpdate.description = this.descriere?this.descriere:"";
        toUpdate.type = $scope.selectedType;
        //form array of selected areas id's
        var areasIDs = [];
        for(var i=0; i<$scope.selectedTherapeuticAreas.length; i++){
            areasIDs.push($scope.selectedTherapeuticAreas[i].id);
        }
        toUpdate['therapeutic-areasID'] = areasIDs;
        //get content text
        toUpdate.text = this.contentText?this.contentText:"";
        //send data to server
        console.log(toUpdate);
        publicContentService.editContent.save({data: {toUpdate: toUpdate, id: idToEdit}}).$promise.then(function (resp) {
            if(resp.error){
                $scope.statusAlert.type = "danger";
            }else{
                $scope.statusAlert.type = "success";
            }
            $scope.statusAlert.message = resp.message;
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

    $scope.closeModal = function(){
        $state.reload();
        $modalInstance.close();
    }

}]);