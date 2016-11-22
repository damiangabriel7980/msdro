controllers.controller('EditCarouselMedic', ['$scope', '$rootScope', '$sce', 'CarouselMedicService', '$modalInstance', '$state', 'idToEdit', 'AmazonService', 'Success', 'Error', function($scope, $rootScope, $sce, CarouselMedicService, $modalInstance, $state, idToEdit, AmazonService,Success,Error){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    $scope.toEdit = {};

    $scope.$watch('toEdit.type', function (newVal) {
        //load all contents of this type
        if(newVal){
            CarouselMedicService.attachedContent.query({type: newVal}).$promise.then(function (resp) {
                $scope.allContent = Success.getObject(resp);
            }).catch(function(err){
                $scope.statusAlert.type = "danger";
                $scope.statusAlert.message = Error.getMessage(err);
                $scope.statusAlert.newAlert = true;
            });
        }
    });

    //------------------------------------------------------------------------------------------------ get current data

    CarouselMedicService.carouselMedic.query({id: idToEdit}).$promise.then(function (resp) {
        $scope.toEdit = Success.getObject(resp);
        $scope.$applyAsync();
        $scope.selectedContent = $scope.toEdit.article_id || {};
    }).catch(function(err){
        $scope.statusAlert.type = "danger";
        $scope.statusAlert.message = Error.getMessage(err);
        $scope.statusAlert.newAlert = true;
    });

    //------------------------------------------------------------------------------------------------- form submission

    //change amazon image
    $scope.fileSelected = function ($files, $event) {
        if($files[0]){
            $scope.uploadAlert.type = "warning";
            $scope.uploadAlert.message = "Se incarca...";
            $scope.uploadAlert.newAlert = true;
            $scope.$apply();

            var extension = $files[0].name.split('.').pop();
            var key = "carousel/medic/image_"+idToEdit+"."+extension;
            //if there already is an image, delete it. Then upload new
            if($scope.toEdit.image_path){
                AmazonService.getClient(function (s3) {
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:$scope.toEdit.image_path}, function (err, data) {
                        if(err){
                            $scope.uploadAlert.type = "danger";
                            $scope.uploadAlert.message = "Eroare la stergerea imaginii vechi!";
                            $scope.uploadAlert.newAlert = true;
                            $scope.$apply();
                        }else{
                            putFile($files[0], key);
                        }
                    });
                });
            }else{
                putFile($files[0], key);
            }
        }
    };

    //change database info
    $scope.editImage = function () {
        //get selected content id
        if($scope.selectedContent && $scope.selectedContent._id) $scope.toEdit.article_id = $scope.selectedContent._id;
        $scope.toEdit.last_updated = new Date();
        CarouselMedicService.carouselMedic.update({id: idToEdit},{data: {toUpdate: $scope.toEdit}}).$promise.then(function (resp) {
                $scope.statusAlert.type = "success";
                $scope.statusAlert.message = Success.getMessage(resp);
            $scope.statusAlert.newAlert = true;
        }).catch(function(err){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.message = Error.getMessage(err);
            $scope.statusAlert.newAlert = true;
        });
    };


    //------------------------------------------------------------------------------------------------ useful functions

    var putFile = function (body, key) {
        AmazonService.getClient(function (s3) {
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read-write'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    CarouselMedicService.carouselMedic.update({id: idToEdit},{data: {imagePath: key}}).$promise.then(function(resp){
                        $scope.uploadAlert.type = "success";
                        $scope.uploadAlert.message = "Upload reusit!";
                        $scope.uploadAlert.newAlert = true;
                        $scope.$apply();
                        console.log("Upload complete");
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

    var findInContent = function(id){
        for(var i=0; i<$scope.allContent.length; i++){
            if($scope.allContent[i]._id === id) return i;
        }
        return -1;
    };

    $scope.trustAsHtml = function (val) {
        return $sce.trustAsHtml(val);
    };

    $scope.typeDisplay = function (type) {
        switch(type){
            case 1: return "National"; break;
            case 2: return "International"; break;
            case 3: return "Stiintific"; break;
            default: return "Necunoscut"; break;
        }
    };

    $scope.closeModal = function(){
        $modalInstance.close();
        $state.reload();
    }

}]);