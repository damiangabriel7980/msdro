/**
 * Created by miricaandrei23 on 27.11.2014.
 */
controllers.controller('EditPathology', ['$scope','$rootScope' ,'PathologiesService','$modalInstance','$state','AmazonService', 'idToEdit', 'Success', 'Error', 'SpecialAppsService', function($scope,$rootScope,PathologiesService,$modalInstance,$state,AmazonService,idToEdit,Success,Error, SpecialAppsService){

    $scope.pathology = {};

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

    var showAlertMessage = function (alertBoxName, type, message, status) {
        $scope[alertBoxName].type = type;
        $scope[alertBoxName].message = message;
        $scope[alertBoxName].newAlert = status;
    };

    $scope.myApps = {
        selectedApps: null
    };

    PathologiesService.pathologies.query({id: idToEdit}).$promise.then(function(response){
        $scope.pathology = Success.getObject(response);
        if($scope.pathology.header_image)
            $scope.header_image = $rootScope.pathAmazonDev + $scope.pathology.header_image;
        $scope.myApps.selectedApps = $scope.pathology.specialApps;
        SpecialAppsService.apps.query().$promise.then(function (resp) {
            $scope.apps = Success.getObject(resp);
        });
        $scope.$applyAsync();
    }).catch(function(err){
        showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
    });

    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "pathologies/"+$scope.pathology._id+"/pathology_header_image/image"+$scope.pathology._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    showAlertMessage('uploadAlert', 'danger', 'Upload esuat!', true);
                    $scope.$apply();
                } else {
                    //update database as well
                    PathologiesService.pathologies.update({id:$scope.pathology._id},{header_image: key}).$promise.then(function (resp) {
                        showAlertMessage('uploadAlert', 'success', "Header image updated!", true);
                        console.log("Upload complete");
                        $scope.header_image = $rootScope.pathAmazonDev + key;
                        $scope.pathology.header_image = key;
                        $scope.$applyAsync();
                    }).catch(function(err){
                        showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
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
                if($scope.pathology.header_image){
                    key = $scope.pathology.header_image;
                    s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                        if(err){
                            showAlertMessage('uploadAlert', 'danger', 'Eroare la stergerea pozei vechi!', true);
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

    $scope.updatePathology = function(closeModal){
        $scope.pathology.last_updated = Date.now();
        var id_apps = [];
        for(var j=0;j<$scope.myApps.selectedApps.length;j++){
            id_apps.push($scope.myApps.selectedApps[j]._id);
        }
        $scope.pathology.specialApps = id_apps;
        PathologiesService.pathologies.update({id: idToEdit}, $scope.pathology).$promise.then(function (resp) {
            if(closeModal){
                $scope.closeModal();
            } else {
                showAlertMessage('uploadAlert', 'success', 'Elementele multimedia asociate au fost actualizate cu succes!', true);
            }
        }).catch(function(err){
            showAlertMessage('statusAlert', 'danger', Error.getMessage(err), true);
        });
    };

    $scope.onMultimediaUpdate = function(key, toDelete){
        var normalizedKey = key.replace(/\s+/g, '%20');
        if(toDelete){
            var position = $scope.pathology.associated_multimedia.indexOf(normalizedKey);
            $scope.pathology.associated_multimedia.splice(position,1);
        } else {
            $scope.pathology.associated_multimedia.push(normalizedKey);
        }
        $scope.updatePathology();
    };

    $scope.closeModal = function () {
        $modalInstance.close();
        $state.go('pathologies',{},{reload: true});
    };
}]);
