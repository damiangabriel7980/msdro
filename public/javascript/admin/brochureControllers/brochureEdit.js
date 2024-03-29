/**
 * Created by andreimirica on 16.05.2016.
 */
/**
 * Created by miricaandrei23 on 27.11.2014.
 */
controllers.controller('brochureEdit', ['$scope','$rootScope' ,'brochureService','$modalInstance','$state','AmazonService', 'idToEdit', 'Success', 'Error', 'tinyMCEConfig', function($scope,$rootScope,brochureService,$modalInstance,$state,AmazonService,idToEdit,Success,Error, tinyMCEConfig){

    $scope.section = {};

    $scope.tinymceOptions = tinyMCEConfig.standardConfig();

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};

    var showAlertMessage = function (alertBoxName, type, message, status) {
        $scope[alertBoxName].type = type;
        $scope[alertBoxName].message = message;
        $scope[alertBoxName].newAlert = status;
    };

    brochureService.brochureSections.query({id: idToEdit}).$promise.then(function(response){
        $scope.section = Success.getObject(response);
        if($scope.section.title_image)
            $scope.title_image = $rootScope.pathAmazonDev + $scope.section.title_image;
        if($scope.section.side_image)
            $scope.side_image = $rootScope.pathAmazonDev + $scope.section.side_image;
        $scope.$applyAsync();
    }).catch(function(err){
        showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
    });

    var putLogoS3 = function (body, sideImage) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "brochure/"+$scope.section._id+"/section_title_image/image"+$scope.section._id+"."+extension;
            if(sideImage){
                key = "brochure/"+$scope.section._id+"/section_side_image/image"+$scope.section._id+"."+extension;
            }
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    showAlertMessage('uploadAlert', 'danger', 'Upload esuat!', true);
                    $scope.$apply();
                } else {
                    //update database as well
                    updateImgLinkInDB(sideImage, key);
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

    function updateImgLinkInDB(sideImage, key) {
        var objectWithUpdates = {
            title_image: key ? key : null
        };
        if(sideImage){
            delete objectWithUpdates.title_image;
            objectWithUpdates.side_image = key ? key : null;
        }
        brochureService.brochureSections.update({id:$scope.section._id},objectWithUpdates).$promise.then(function (resp) {
            showAlertMessage('uploadAlert', 'success', key ? "Image upload complete!" : "Image deleted successfully!", true);
            if(sideImage){
                $scope.side_image = key ? $rootScope.pathAmazonDev + key : null;
                $scope.section.side_image = key ? key : null;
            } else {
                $scope.title_image = key ? $rootScope.pathAmazonDev + key : null;
                $scope.section.title_image = key ? key : null;
            }
            $scope.$applyAsync();
        }).catch(function(err){
            showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
        });
    }

    $scope.fileSelected = function($files, $event, sideImage){
        //make sure group data is loaded. we need to access it to form the amazon key
        //make sure a file was actually loaded
        if($files[0]){
            AmazonService.getClient(function (s3) {
                var key = sideImage ? $scope.section.side_image : $scope.section.title_image;
                //if there already is a logo, delete it. Then upload new
                if(key){
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            showAlertMessage('uploadAlert', 'danger', 'Eroare la stergerea pozei vechi!', true);
                            $scope.$apply();
                        }else{
                            putLogoS3($files[0], sideImage);
                        }
                    });
                }else{
                    putLogoS3($files[0], sideImage);
                }
            });
        }

    };

    $scope.updateSection = function(closeModal){
        $scope.section.last_updated = Date.now();
        brochureService.brochureSections.update({id: idToEdit}, $scope.section).$promise.then(function (resp) {
            if(closeModal){
                $scope.closeModal();
            } else {
                showAlertMessage('uploadAlert', 'success', 'Elementele multimedia asociate au fost actualizate cu succes!', true);
            }
        }).catch(function(err){
            showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
        });
    };

    $scope.removeImage = function (imagePath, sideImage) {
        AmazonService.deleteFile(imagePath,function(err, success){
            if(err){
                showAlertMessage('uploadAlert', 'error', "Eroare la stergerea imaginii!", true);
            }else{
                updateImgLinkInDB(sideImage);
            }
        });
    };

    $scope.closeModal = function () {
        $modalInstance.close();
        $state.go('brochure',{},{reload: true});
    };
}]);
