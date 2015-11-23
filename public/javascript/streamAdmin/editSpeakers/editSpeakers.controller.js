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
            var userExists;
            if(user._id == null)
                user.username = angular.element('#emailField')[0].value;
            angular.forEach($scope.currentUsers, function(item) {
                if(item.username.toLowerCase() == user.username.toLowerCase()){
                    userExists = true;
                }
            });
            if(!userExists){
                liveConferences.update({id: idToEdit, addSpeaker : true, single: true},{user: user}).$promise.then(function(resp){
                    angular.forEach(Success.getObject(resp).speakers, function(item) {
                        if(item.username.toLowerCase() == user.username.toLowerCase()){
                            $scope.currentUsers.push(user);
                            $scope.newlyAddedSpk.push(user);
                        }
                    });
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

    $scope.removeSpeaker = function(index,user){
        var userData;
            userData = {
                role: 'speaker',
                username: user.username
            };
            liveConferences.update({id: idToEdit,removeUser : true},userData).$promise.then(function(resp){
                $scope.currentUsers.splice(index,1);
                angular.forEach($scope.newlyAddedSpk, function(item, key) {
                    if(item.username.toLowerCase() == user.username.toLowerCase()){
                        $scope.newlyAddedSpk.splice(key,1);
                    }
                });
            })
    };

      userService.users.query().$promise.then(function(resp){
      $scope.speakers = Success.getObject(resp);
    });

      $scope.saveSpk = function(){
          liveConferences.update({id: idToEdit, addSpeaker : true},$scope.currentUsers).$promise.then(function(resp){
              $modalInstance.close();
              $rootScope.$broadcast ('updatedUsers', {newUsers :Success.getObject(resp).speakers , spkToSendNotif:  $scope.newlyAddedSpk});
          });
      };
  }]);
