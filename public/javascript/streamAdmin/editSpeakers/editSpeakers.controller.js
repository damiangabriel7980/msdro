'use strict';

controllers
  .controller('EditSpeakersCtrl', [ '$scope', '$sce' ,'$state' , '$rootScope', 'userService', '$filter', 'idToEdit', 'Success', 'Error', 'getIds', 'liveConferences', '$modalInstance', '$timeout', function ($scope, $sce, $state, $rootScope, userService,$filter, idToEdit,Success,Error,getIds,liveConferences,$modalInstance,$timeout) {
    $scope.selectedUser = {
      name: '',
      _id: null,
        username: ''
    };

      $scope.showError = function(message) {
          $scope.statusAlert.type = "danger";
          $scope.statusAlert.newAlert = true;
          $scope.statusAlert.text = message;
          $timeout(function(){
              $scope.statusAlert.newAlert = false;
              $scope.statusAlert.text = null;
          },4000);
      };

    $scope.addSpk = function(user,isValid){
        if(!isValid){
            $scope.showError("Campul 'Nume' este obligatoriu!");
        } else {
            var userExists;
            if(user._id == null)
                user.username = angular.element('#emailField')[0].value;
            if(user.username.length == 0){
                $scope.showError("Campul 'Email' este obligatoriu!");
            } else {
                userService.checkEmail.verify({checkEmailAddress: true},user).$promise.then(function(resp){
                    angular.forEach($scope.currentUsers, function(item) {
                        if(item.username.toLowerCase() == user.username.toLowerCase()){
                            userExists = true;
                        }
                    });
                    if(!userExists){
                        user.invited = false;
                        $scope.currentUsers.push(user);
                        $scope.selectedUser = null;
                        angular.element('#emailField')[0].value = '';
                        angular.element('#spkName')[0].value = '';
                    } else
                        $scope.showError('Exista deja un utilizator cu acest nume in lista!');
                }).catch(function(err){
                    $scope.showError(Error.getMessage(err));
                });
            }
        }
    };

      $scope.statusAlert = {newAlert:false, type:"", message:""};

      liveConferences.query({id: idToEdit}).$promise.then(function(resp){
          $scope.objectToEdit = Success.getObject(resp);
          $scope.currentUsers = $scope.objectToEdit.speakers;
      });

    $scope.removeSpeaker = function(index,user){
        $scope.currentUsers.splice(index,1);
    };

      userService.users.query().$promise.then(function(resp){
      $scope.speakers = Success.getObject(resp);
    });

      $scope.saveSpk = function(){
          liveConferences.update({id: idToEdit, addSpeaker : true},$scope.currentUsers).$promise.then(function(resp){
              $modalInstance.close();
              $rootScope.$broadcast ('updatedUsers', {newUsers :Success.getObject(resp).speakers});
          });
      };
  }]);
