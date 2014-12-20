/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('speakerUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','growl','AmazonService', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,growl,AmazonService){
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    var speakerDataLoaded=false;
    EventsAdminService.deleteOrUpdateSpeakers.getSpeaker({id:$stateParams.id}).$promise.then(function(result){
        $scope.newSpeaker=result;
        speakerDataLoaded=true;
        tinyMCE.activeEditor.setContent($scope.newSpeaker.short_description);
    });
    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "speakers/"+$scope.newSpeaker._id+"/speaker-logo/logo"+$scope.newSpeaker._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    EventsAdminService.changeSpeakerLogo.save({data:{id:$scope.newSpeaker._id, path:key}}).$promise.then(function (resp) {
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
        if(speakerDataLoaded){
            //make sure a file was actually loaded
            if($files[0]){
                AmazonService.getClient(function (s3) {
                    var key;
                    //if there already is a logo, delete it. Then upload new
                    if($scope.newSpeaker.image_path){
                        key =$scope.newSpeaker.image_path;
                        s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
                            if(err){
                                $scope.uploadAlert.type = "danger";
                                $scope.uploadAlert.message = "Eroare la stergerea logo-ului vechi!";
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
        }
    };

    $scope.updateSpeaker=function(){
        $scope.newSpeaker.short_description=tinyMCE.activeEditor.getContent();
        EventsAdminService.deleteOrUpdateSpeakers.update({id:$stateParams.id},$scope.newSpeaker).$promise.then(function(result){
        if(result.message)
                growl.addSuccessMessage(result.message);
        else
            growl.addWarnMessage(result);
        });

    };
    $scope.okk=function(){
        $state.go('continut.evenimente');
    };
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };
}]);
