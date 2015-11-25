'use strict';

controllers
  .controller('EditViewersCtrl', [ '$scope', '$filter', '$sce' ,'$state' , '$rootScope', 'userService', 'ngTableParams', 'Success', 'Error', 'getIds', 'liveConferences', 'filterArrayProperty', '$modalInstance', 'idToEdit', '$timeout', function ($scope, $filter, $sce, $state, $rootScope,userService, ngTableParams,Success,Error,getIds,liveConferences,filterArrayProperty,$modalInstance,idToEdit,$timeout) {
    $scope.selectedGroup = {
        currentGroup : {
            display_name: '',
            _id: null
        }
    };

    userService.groups.query().$promise.then(function(resp){
      $scope.groups = Success.getObject(resp);
    });

      $scope.newlyAddedVw = [];
      $scope.idToEdit = idToEdit;
      $scope.checkboxes = { items: {} };
      $scope.oldCheckboxes = { items: {} };

    $scope.selectAll = function(value) {
      angular.forEach($scope.tableParams.data, function(item) {
          $scope.checkValue(item.username,value);
      });
    };

    // watch for data checkboxes
    $scope.checkValue = function(username,value){
        if(!value){
            delete $scope.checkboxes.items[username];
        } else {
            $scope.checkboxes.items[username] = value;
        }
    };

      $scope.removeViewer = function(index,user){
          var userData;
          userData = {
              role: 'viewer',
              username: user.username
          };
          liveConferences.update({id: idToEdit,removeUser : true},userData).$promise.then(function(resp){
              $scope.editedViewers.unregistered.splice(index,1);
              angular.forEach($scope.newlyAddedVw, function(item, key) {
                  if(item.username.toLowerCase() == user.username.toLowerCase()){
                      $scope.newlyAddedVw.splice(key,1);
                  }
              });
          })
      };

      liveConferences.query({id: idToEdit, separatedViewers : true}).$promise.then(function(resp){
          $scope.editedViewers = Success.getObject(resp);
      });

      $scope.loadUsers = function() {
                  userService.users.query({groups: true}).$promise.then(function(resp2){
                      $scope.data = Success.getObject(resp2);
                      angular.forEach($scope.editedViewers.registered, function(item) {
                          $scope.checkboxes.items[item.username] = true;
                      });
                      $scope.oldCheckboxes = $scope.checkboxes;
                      $scope.oldData = $scope.data;
                      $scope.tableParams = new ngTableParams({
                          page: 1,            // show first page
                          count: 10,          // count per page
                          sorting: {
                              name: 'asc'     // initial sorting
                          },
                          filter: {
                              name: ''       // initial filter
                          }
                      }, {
                          total: $scope.data.length, // length of data
                          getData: function($defer, params) {

                              var filters = {};

                              angular.forEach(params.filter(), function(value, key) {
                                  if (key.indexOf('.') === -1) {
                                      filters[key] = value;
                                      return;
                                  }

                                  var createObjectTree = function (tree, properties, value) {
                                      if (!properties.length) {
                                          return value;
                                      }

                                      var prop = properties.shift();

                                      if (!prop || !/^[a-zA-Z]/.test(prop)) {
                                          throw new Error('invalid nested property name for filter');
                                      }

                                      tree[prop] = createObjectTree({}, properties, value);

                                      return tree;
                                  };

                                  var filter = createObjectTree({}, key.split('.'), value);

                                  angular.extend(filters, filter);
                              });

                              var orderedData = params.filter() ? $filter('orderBy')(($filter('filter')($scope.data, filters)), params.orderBy()) : $scope.data;
                              params.total(orderedData.length);
                              if(params.total() < (params.page() -1) * params.count()){
                                  params.page(1);
                              }
                              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                          }
                      }, { dataset: $scope.data});


                  });
                  $scope.$watch('selectedGroup.currentGroup',function(){
                          if(!$scope.selectedGroup.currentGroup.display_name) {
                              $scope.data = $scope.oldData;
                          }
                          else
                              $scope.data = filterArrayProperty.getData($scope.data,'groupsID','display_name',$scope.selectedGroup.currentGroup.display_name);
                          if($scope.tableParams)
                              $scope.tableParams.reload();
                  });
      };



      $scope.statusAlert = {newAlert:false, type:"", message:""};


      $scope.saveData = function(){
          if($scope.oldData){
              $scope.editedViewers.registered = [];
              angular.forEach($scope.oldData, function(item) {
                  if($scope.checkboxes.items[item.username]){
                      $scope.editedViewers.registered.push(item);
                      if(!$scope.oldCheckboxes.items[item.username])
                              $scope.newlyAddedVw.push(item);
                  }
              });
          }
        $scope.allViewers = $scope.editedViewers.registered.concat($scope.editedViewers.unregistered);
        liveConferences.update({id: $scope.idToEdit,addViewers : true},$scope.allViewers).$promise.then(function(resp){
            $modalInstance.close();
            $rootScope.$broadcast ('updatedUsers', {newUsers :Success.getObject(resp).viewers , viewers : true, vwToSendNotif : $scope.newlyAddedVw});
        })
    };

      $scope.showAlert = function(type,message){
          $scope.statusAlert.type = type;
          $scope.statusAlert.text = message;
          $scope.statusAlert.newAlert = true;
      };

      $scope.addViewer = function(isValid,thisForm){
          if(isValid){
              var checkIfAlreadyAdded;
              angular.forEach($scope.editedViewers.unregistered, function(item) {
                  if(item.username.toLowerCase() == thisForm.viewer.username.toLowerCase()){
                      checkIfAlreadyAdded = true;
                  }
              });
              if(checkIfAlreadyAdded) {
                  $scope.showAlert("danger","Ati adaugat deja in lista un utilizator cu acest email!");
                  $timeout(function(){
                      $scope.statusAlert.newAlert = false;
                      $scope.statusAlert.text = null;
                  },4000);
              }
              else {
                  liveConferences.update({id :$scope.idToEdit, addViewers : true, single: true},thisForm.viewer).$promise.then(function(resp){
                      $scope.editedViewers.unregistered.push(thisForm.viewer);
                      $scope.newlyAddedVw.push(thisForm.viewer);
                      thisForm.viewer = null;
                      thisForm.viewerForm.nume.$touched = false;
                      thisForm.viewerForm.email.$touched = false;

                  }).catch(function(err){
                      $scope.showAlert("danger",Error.getMessage(err));
                      $timeout(function(){
                          $scope.statusAlert.newAlert = false;
                          $scope.statusAlert.text = null;
                      },4000);
                  });
              }
          } else {
              $scope.showAlert("danger","Exista campuri goale! Verificati formularul inca o data!");
              if(!thisForm.viewer.nume)
                  thisForm.viewerForm.nume.$touched = true;
              if(!thisForm.viewer.email)
                  thisForm.viewerForm.email.$touched = true;
              $timeout(function(){
                  $scope.statusAlert.newAlert = false;
                  $scope.statusAlert.text = null;
              },4000);
          }
      };
  }]);
