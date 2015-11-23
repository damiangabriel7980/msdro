'use strict';

controllers
  .controller('EditConferenceCtrl', [ '$scope', '$filter', '$sce' ,'$state' , 'AmazonService', '$rootScope', 'liveConferences', 'idToEdit', 'Success', '$modal', '$modalInstance', 'getIds', 'Error', 'therapeuticAreaService', 'userService', 'sendNotification', '$timeout',function ($scope, $filter, $sce, $state,AmazonService, $rootScope, liveConferences,idToEdit,Success,$modal,$modalInstance,getIds,Error,therapeuticAreaService,userService,sendNotification,$timeout) {
    $scope.selectedModerator = {
      name: '',
      _id: 0,
      username: ''
    };

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

    userService.users.query().$promise.then(function(resp){
      $scope.users = Success.getObject(resp);
    });

    liveConferences.query({id: idToEdit}).$promise.then(function(resp){
      $scope.objectToEdit = Success.getObject(resp);
      $scope.oldDate = $scope.objectToEdit.date;

      $scope.oldSpks = $scope.objectToEdit.speakers;
      $scope.oldVws = $scope.objectToEdit.viewers;

      $scope.selectedAreas = Success.getObject(resp)['therapeutic-areasID'];
      $timeout(function() {
        $scope.selectedModerator = $scope.objectToEdit.moderator;
        angular.element('#moderator')[0].value = $scope.selectedModerator.username ? $scope.selectedModerator.username : null;
      },700);
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

      $scope.usersToBeNotified = {
        speakers : [],
        viewers : [],
        moderator: {}
      };

      $scope.$on("updatedUsers", function(events, args){
            if(args.viewers) {
              $scope.objectToEdit.viewers = args.newUsers;
              $scope.usersToBeNotified.viewers = args.vwToSendNotif;
            }
        else {
              $scope.objectToEdit.speakers = args.newUsers;
              $scope.usersToBeNotified.speakers = args.spkToSendNotif;
            }
      });

      $scope.minDate = new Date();
      $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
      };

      $scope.updateNotification = function(){
        var spkString = '';
        angular.forEach($scope.oldSpks, function(item, key) {
          if (key == 0)
            spkString += item.name;
          else
            spkString += ', ' + item.name;
        });
        angular.forEach($scope.usersToBeNotified.speakers, function(item, key) {
            spkString += ', ' + item.name;
        });
        $scope.objectToEdit.moderator = {
          name: $scope.selectedModerator ? $scope.selectedModerator.name:angular.element('#name')[0].value,
          username: $scope.selectedModerator ? $scope.selectedModerator.username:angular.element('#moderator')[0].value
        };
        $scope.usersToNotify = {
            speakers: $scope.oldSpks,
            viewers: $scope.oldVws,
            moderator: $scope.objectToEdit.moderator
        };
        sendNotification.notification.update({id: $scope.objectToEdit.id},{conference: $scope.objectToEdit, usersToInvite: $scope.usersToBeNotified, usersToNotify: $scope.usersToNotify, spkString: spkString}).$promise.then(function(resp){
          resetConferenceAlert("Notificarea si invitatiile au fost trimise cu succes!",'success');
        }).catch(function(err){
          console.log(Error.getMessage(err));
          resetConferenceAlert("Eroare la trimiterea notificarii/invitatiilor!");
        });
      };

      $scope.sendInvitations = function(){
        var spkString = '';
        if($scope.usersToBeNotified.speakers.length == 0 && $scope.usersToBeNotified.viewers.length == 0){
          $scope.usersToBeNotified.speakers = $scope.objectToEdit.speakers;
          $scope.usersToBeNotified.viewers = $scope.objectToEdit.viewers;
          angular.forEach($scope.usersToBeNotified.speakers, function(item, key) {
            if (key == 0)
              spkString += item.name;
            else
              spkString += ', ' + item.name;
          });
          $scope.objectToEdit.moderator = {
            username: angular.element('#moderator')[0].value == '' ? null:angular.element('#moderator')[0].value
          };
          $scope.usersToBeNotified.moderator = $scope.objectToEdit.moderator;
          sendNotification.notification.create({id: $scope.objectToEdit.id},{conference: $scope.objectToEdit, usersToNotify: $scope.usersToBeNotified, spkString: spkString}).$promise.then(function(resp){
            resetConferenceAlert("Invitatiile au fost trimise cu succes!",'success');
          }).catch(function(err){
            console.log(Error.getMessage(err));
            resetConferenceAlert("Eroare la trimiterea invitatiilor!");
          });
        } else {
          angular.forEach($scope.usersToBeNotified.speakers, function(item, key) {
            if (key == 0)
              spkString += item.name;
            else
              spkString += ', ' + item.name;
          });
          sendNotification.notification.create({id: $scope.objectToEdit.id},{conference: $scope.objectToEdit, usersToNotify: $scope.usersToBeNotified, spkString: spkString}).$promise.then(function(resp){
            resetConferenceAlert("Invitatiile au fost trimise cu succes!",'success');
          }).catch(function(err){
            console.log(Error.getMessage(err));
            resetConferenceAlert("Eroare la trimiterea invitatiilor!");
          });
        }
      };

      $scope.updateConference = function(id, confForm){
        if(confForm.nume.$valid && confForm.locatie.$valid){
          var currentDate = new Date();
          if(new Date($scope.objectToEdit.date).getTime() < currentDate.getTime() && new Date($scope.objectToEdit.date).getTime() != new Date($scope.oldDate).getTime())
            resetConferenceAlert("Data conferintei nu poate fi mai mica decat data curenta!");
          else {
            if($scope.selectedModerator && $scope.selectedModerator._id){
              $scope.objectToEdit.moderator.username = $scope.selectedModerator.username;
              $scope.objectToEdit.moderator.name = $scope.selectedModerator.name;
            } else
              $scope.objectToEdit.moderator = {
                name: angular.element('#moderatorName')[0].value == '' ? null:angular.element('#moderatorName')[0].value,
                username: angular.element('#moderator')[0].value == '' ? null:angular.element('#moderator')[0].value
              };
            $scope.objectToEdit['therapeutic-areasID'] = $scope.returnedAreas;
            $scope.objectToEdit.last_modified = new Date();
            liveConferences.update({id: id},$scope.objectToEdit).$promise.then(function(resp){
              $modalInstance.close();
              $state.go('liveConferences',{},{reload: true});
            }).catch(function(err){
              console.log(Error.getMessage(err));
            });
          }
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

    $scope.removeUser = function(index,username,roleUs){
      var userData = {};
      if($scope.usersToBeNotified.speakers.length > 0 || $scope.usersToBeNotified.viewers.length > 0){
        if(roleUs == 'speaker')
          angular.forEach($scope.usersToBeNotified.speakers, function(item, key) {
             if(item.username == username){
              $scope.usersToBeNotified.speakers.splice(key,1);
            }
           });
        else
          angular.forEach($scope.usersToBeNotified.viewers, function(item, key) {
          if(item.username == username){
            $scope.usersToBeNotified.viewers.splice(key,1);
          }
        });
      }
        userData = {
          role: roleUs,
          username: username
        };
        liveConferences.update({id: idToEdit,removeUser : true},userData).$promise.then(function(resp){
          if(roleUs == 'speaker'){
            $scope.objectToEdit.speakers.splice(index,1);
          } else
            $scope.objectToEdit.viewers.splice(index,1);
        })
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
