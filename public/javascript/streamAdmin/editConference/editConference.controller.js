'use strict';

streamAdminControllers
  .controller('EditConferenceCtrl', [ '$scope', '$filter', '$sce' ,'$state' , 'AmazonService', '$rootScope', 'liveConferences', function ($scope, $filter, $sce, $state,AmazonService, $rootScope, liveConferences) {
    var putLogoS3 = function (body) {
      AmazonService.getClient(function (s3) {
        var extension = body.name.split('.').pop();
        var key = "conferences/" + $scope.modal.objectToEdit._id + "/" + $scope.modal.objectToEdit._id + "."+extension;
        var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            //update database as well
            $scope.modal.objectToEdit.image = key;
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

    $scope.editModalSpk = Modal.confirm.editSpeakers(function(conferenceSpk){
        $state.reload();
    });

    $scope.editModalVw = Modal.confirm.editViewers(function(conferenceVw){
      $state.reload();
    });

    $scope.editSpk = function(conference){
      $scope.editModalSpk(conference.speakers);
    };

    $scope.editVw = function(conference){
      $scope.editModalVw(conference.viewers);
    };

    $scope.removeSpeaker = function(index){
      $scope.modal.objectToEdit.speakers.splice(index,1);
    };

    $scope.fileSelected = function($files, $event){
      //make sure group data is loaded. we need to access it to form the amazon key
      //make sure a file was actually loaded
      if($files[0]){
        AmazonService.getClient(function (s3) {
          var key;
          //if there already is a logo, delete it. Then upload new
          if(typeof $scope.modal.objectToEdit.image == 'string'){
            key=$scope.modal.objectToEdit.image;
            s3.deleteObject({Bucket: $rootScope.amazonBucket, Key:key}, function (err, data) {
              if(err){
                console.log(err);
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


  }]);
