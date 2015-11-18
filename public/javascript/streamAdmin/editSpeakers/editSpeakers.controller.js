'use strict';

controllers
  .controller('EditSpeakersCtrl', [ '$scope', '$sce' ,'$state' , '$rootScope', 'userService', '$filter','speakersToEdit', 'idToEdit', 'Success', 'Error', 'getIds', 'liveConferences', '$modalInstance', function ($scope, $sce, $state, $rootScope, userService,$filter, speakersToEdit, idToEdit,Success,Error,getIds,liveConferences,$modalInstance) {
    $scope.selectedUser = {
      name: '',
      _id: null,
        username: ''
    };

      $scope.newlyAddedSpk = [];

    $scope.addSpk = function(user,isValid){
        if(!isValid){
            $scope.statusAlert.type = "danger";
            $scope.statusAlert.text = "Exista campuri goale! Verificati formularul inca o data!";
            $scope.statusAlert.newAlert = true;
        } else {
            if(user._id == null) {
                user.username = angular.element('#emailField')[0].value;
                user.registered = false;
                liveConferences.update({id: idToEdit, addSpeaker : true, single: true},{user: user}).$promise.then(function(resp){
                    angular.forEach(Success.getObject(resp).speakers.unregistered, function(item) {
                        if(item.username.toLowerCase() == user.username.toLowerCase()){
                            $scope.currentUsers.unregistered.push(user);
                            $scope.newlyAddedSpk.push(user);
                        }
                    });
                }).catch(function(err){
                    $scope.statusAlert.type = "danger";
                    $scope.statusAlert.text = Error.getMessage(err);
                    $scope.statusAlert.newAlert = true;
                });
            }
            else {
                if($scope.currentUsers.registered.length > 0){
                    var ids = getIds.extract($scope.currentUsers.registered);
                    if(ids.indexOf(user._id) > -1)
                        return;
                    else {
                        user.registered = true;
                        liveConferences.update({id: idToEdit, addSpeaker : true, single: true},{user: user}).$promise.then(function(resp){
                            $scope.currentUsers.registered.push(user);
                            $scope.newlyAddedSpk.push(user);
                        }).catch(function(err){
                            $scope.statusAlert.type = "danger";
                            $scope.statusAlert.text = Error.getMessage(err);
                            $scope.statusAlert.newAlert = true;
                        });
                    }
                } else
                    liveConferences.update({id: idToEdit, addSpeaker : true, single: true},{user: user}).$promise.then(function(resp){
                        $scope.currentUsers.registered.push(user);
                        $scope.newlyAddedSpk.push(user);
                    }).catch(function(err){
                        $scope.statusAlert.type = "danger";
                        $scope.statusAlert.text = Error.getMessage(err);
                        $scope.statusAlert.newAlert = true;
                    });
            }
        }
    };
      $scope.statusAlert = {newAlert:false, type:"", message:""};

      $scope.currentUsers = speakersToEdit;

    $scope.removeSpeaker = function(index,user,unregistered){
        var userData = {};
        if(unregistered){
            userData = {
                role: 'speaker',
                registered: false,
                id: user._id
            };
            liveConferences.update({id: idToEdit,removeUser : true},userData).$promise.then(function(resp){
                $scope.currentUsers.unregistered.splice(index,1);
                angular.forEach($scope.newlyAddedSpk, function(item, key) {
                    if(item._id == user._id){
                        $scope.newlyAddedSpk.splice(key,1);
                    }
                });
            })
        }
        else {
            userData = {
                role: 'speaker',
                registered: true,
                id: user._id
            };
            liveConferences.update({id: idToEdit,removeUser : true},userData).$promise.then(function(resp){
                $scope.currentUsers.registered.splice(index,1);
                angular.forEach($scope.newlyAddedSpk, function(item, key) {
                    if(item._id == user._id){
                        $scope.newlyAddedSpk.splice(key,1);
                    }
                });
            })
        }
    };

      userService.users.query().$promise.then(function(resp){
      $scope.speakers = Success.getObject(resp);
    });

      $scope.saveSpk = function(){
          $scope.currentUsers.registered = getIds.extract($scope.currentUsers.registered);
          liveConferences.update({id: idToEdit, addSpeaker : true},$scope.currentUsers).$promise.then(function(resp){
              $modalInstance.close();
              $rootScope.$broadcast ('updatedUsers', {newUsers :Success.getObject(resp).speakers , spkToSendNotif:  $scope.newlyAddedSpk});
          });
      };
  }]);
