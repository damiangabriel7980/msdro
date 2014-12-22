/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('conferenceUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl','AmazonService', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl,AmazonService){

    $scope.statusAlert = {newAlert:false, type:"", message:""};
    $scope.uploadAlert = {newAlert:false, type:"", message:""};
    $scope.string = "";
    $scope.notificationCheck = false;

    var conferenceDataLoaded=false;
    EventsAdminService.getAllRoom.query().$promise.then(function(resp) {
        $scope.rooms = resp;
        EventsAdminService.deleteOrUpdateConferences.getConference({id: $stateParams.id}).$promise.then(function (result2) {

            $scope.newConference = result2;
            $scope.string = JSON.stringify($scope.newConference.qr_code);
            conferenceDataLoaded=true;
            console.log(result2);
        });
    });
    $scope.messageString="";

    var putLogoS3 = function (body) {
        AmazonService.getClient(function (s3) {
            var extension = body.name.split('.').pop();
            var key = "conferences/"+$scope.newConference._id+"/conference-logo/logo"+$scope.newConference._id+"."+extension;
            var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
                if (err) {
                    console.log(err);
                    $scope.uploadAlert.type = "danger";
                    $scope.uploadAlert.message = "Upload esuat!";
                    $scope.uploadAlert.newAlert = true;
                    $scope.$apply();
                } else {
                    //update database as well
                    EventsAdminService.changeConferenceLogo.save({data:{id:$scope.newConference._id, path:key}}).$promise.then(function (resp) {
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
        if(conferenceDataLoaded){
            //make sure a file was actually loaded
            if($files[0]){
                AmazonService.getClient(function (s3) {
                    var key;
                    //if there already is a logo, delete it. Then upload new
                    if($scope.newConference.image_path){
                        key =$scope.newConference.image_path;
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

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened1 = true;
    };
    $scope.open2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened2 = true;
    };
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.updateConference=function(){
        $scope.utc1 = new Date($scope.newConference.begin_date);
        $scope.utc2 = new Date($scope.newConference.end_date);
        $scope.newConference.begin_date=$scope.utc1;
        $scope.newConference.end_date=$scope.utc2;
        if($scope.notificationCheck){
            $scope.newConference.notificationText = $scope.notificationText;
        }
        console.log($scope.newConference);
        if($scope.newConference){
            EventsAdminService.deleteOrUpdateConferences.update({id: $stateParams.id}, $scope.newConference).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
        }
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

}])
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });

