'use strict';

streamAdminControllers
  .controller('EditSpeakersCtrl', [ '$scope', '$sce' ,'$state' , '$rootScope', 'user', '$filter', function ($scope, $sce, $state, $rootScope, user,$filter) {
    $scope.selectedUser = {
      name: '',
      _id: null
    };

    $scope.addSpk = function(user){
      $scope.modal.objectToEdit.push(user);
    };

    $scope.removeSpeaker = function(index){
      $scope.modal.objectToEdit.splice(index,1);
    };

    user.confUsers.query({role: 'speaker'}).$promise.then(function(resp){
      $scope.speakers = resp.users;
    })
  }]);
