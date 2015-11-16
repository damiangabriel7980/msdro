'use strict';

controllers
  .controller('EditConferenceCtrl', [ '$scope', '$filter', '$sce' ,'$state' , 'AmazonService', '$rootScope', 'liveConferences', 'idToEdit', 'Success', '$modal', '$modalInstance', 'getIds', 'Error', 'therapeuticAreaService',function ($scope, $filter, $sce, $state,AmazonService, $rootScope, liveConferences,idToEdit,Success,$modal,$modalInstance,getIds,Error,therapeuticAreaService) {
    var putLogoS3 = function (body) {
      AmazonService.getClient(function (s3) {
        var extension = body.name.split('.').pop();
        var key = "conferences/" + $scope.objectToEdit._id + "/" + $scope.objectToEdit._id + "."+extension;
        var req = s3.putObject({Bucket: $rootScope.amazonBucket, Key: key, Body: body, ACL:'public-read'}, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            //update database as well
            liveConferences.update({id: idToEdit, updateImage: true},{image_path: key}).$promise.then(function(resp){
              $scope.objectToEdit.image_path = key;
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

      liveConferences.query({id: idToEdit}).$promise.then(function(resp){
          $scope.objectToEdit = Success.getObject(resp);
          $scope.selectedAreas = Success.getObject(resp)['therapeutic-areasID'];
      });

    therapeuticAreaService.query().$promise.then(function (resp) {
      $scope.areas = Success.getObject(resp);
    }).catch(function(err){
      console.log(Error.getMessage(err));
    });

    var resetConferenceAlert = function (text, type) {
      $scope.conferenceAlert = {
        text: text,
        type: type || "danger"
      };
    };

      $scope.$on("updatedUsers", function(events, args){
            if(args.viewers)
              $scope.objectToEdit.viewers = args.newUsers;
        else
           $scope.objectToEdit.speakers = args.newUsers;
      });

      $scope.minDate = new Date();
      $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
      };

      $scope.updateConference = function(id, confForm){
        if(confForm.nume.$valid && confForm.locatie.$valid){
          $scope.objectToEdit.speakers.registered = getIds.extract($scope.objectToEdit.speakers.registered);
          $scope.objectToEdit.viewers.registered = getIds.extract($scope.objectToEdit.speakers.registered);
          $scope.objectToEdit['therapeutic-areasID'] = $scope.returnedAreas;
          liveConferences.update({id: id},$scope.objectToEdit).$promise.then(function(resp){
            $modalInstance.close();
            $state.go('liveConferences',{},{reload: true});
          }).catch(function(err){
            console.log(Error.getMessage(err));
          });
        } else {
          resetConferenceAlert("Exista campuri goale! Verificati formularul inca o data!");
        }

      };


    $scope.editSpk = function(id, speakers){
      $modal.open({
        templateUrl: 'partials/streamAdmin/editSpeakers.html',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve : {
          idToEdit: function () {
            return id;
          },
          speakersToEdit : function () {
            return speakers;
          }
        },
        windowClass: 'fade',
        controller:"EditSpeakersCtrl"
      });
    };

    $scope.removeUser = function(index,id,unregistered,roleUs){
      var userData = {};
      if(unregistered){
        userData = {
          role: roleUs,
          registered: false,
          id: id
        };
        liveConferences.update({id: idToEdit,removeUser : true},userData).$promise.then(function(resp){
          if(roleUs == 'speaker')
            $scope.objectToEdit.speakers.unregistered.splice(index,1);
          else
            $scope.objectToEdit.viewers.unregistered.splice(index,1);
        })
      }
      else {
        userData = {
          role: roleUs,
          registered: true,
          id: id
        };
        liveConferences.update({id: idToEdit,removeUser : true},userData).$promise.then(function(resp){
          if(roleUs == 'speaker')
            $scope.objectToEdit.speakers.registered.splice(index,1);
          else
            $scope.objectToEdit.viewers.registered.splice(index,1);
        })
      }
    };

    $scope.editVw = function(id, viewers){
      $modal.open({
        templateUrl: 'partials/streamAdmin/editViewers.html',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        resolve : {
          idToEdit: function () {
            return id;
          },
          viewersToEdit : function () {
            return viewers;
          }
        },
        windowClass: 'fade',
        controller:"EditViewersCtrl"
      });
    };

    $scope.fileSelected = function($files, $event){
      //make sure group data is loaded. we need to access it to form the amazon key
      //make sure a file was actually loaded
      if($files[0]){
        AmazonService.getClient(function (s3) {
          var key;
          //if there already is a logo, delete it. Then upload new
          if(typeof $scope.objectToEdit.image == 'string'){
            key=$scope.objectToEdit.image;
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
