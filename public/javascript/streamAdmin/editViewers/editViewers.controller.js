'use strict';

controllers
  .controller('EditViewersCtrl', [ '$scope', '$filter', '$sce' ,'$state' , '$rootScope', 'userService', 'ngTableParams', 'Success', 'Error', 'getIds', 'liveConferences', 'filterArrayProperty', '$modalInstance', 'idToEdit', 'viewersToEdit', 'Validations', function ($scope, $filter, $sce, $state, $rootScope,userService, ngTableParams,Success,Error,getIds,liveConferences,filterArrayProperty,$modalInstance,idToEdit, viewersToEdit,Validations) {
    $scope.selectedGroup = {
      display_name: '',
      _id: null
    };

    userService.groups.query().$promise.then(function(resp){
      $scope.groups = Success.getObject(resp);
    });

      $scope.newlyAddedVw = {
          registered: [],
          unregistered: []
      };


      $scope.checkboxes = { items: {} };
      $scope.oldCheckboxes = { items: {} };

    $scope.$watch('selectedGroup',function(){
      if($scope.data){
        if(!$scope.selectedGroup.display_name) {
          $scope.data = $scope.oldData;
        }
        else
          $scope.data = filterArrayProperty.getData($scope.data,'groupsID','display_name',$scope.selectedGroup.display_name);
        $scope.tableParams.reload();
      }
    });

    $scope.selectAll = function(value) {
      angular.forEach($scope.data, function(item) {
          $scope.checkValue(item._id,value);
      });
    };

    // watch for data checkboxes
    $scope.checkValue = function(id,value){
        if(!value){
            delete $scope.checkboxes.items[id];
        } else {
            $scope.checkboxes.items[id] = value;
        }
    };

    userService.users.query({groups: true}).$promise.then(function(resp){
      $scope.data = Success.getObject(resp);
        $scope.idToEdit = idToEdit;
        $scope.editedViewers = viewersToEdit;
        angular.forEach($scope.editedViewers.registered, function(item) {
            $scope.checkboxes.items[item._id] = true;
        });
        angular.forEach($scope.editedViewers.unregistered, function(item) {
            $scope.checkboxes.items[item._id] = true;
            $scope.data.push(item);
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

          var orderedData = $filter('orderBy')(($filter('filter')($scope.data, params.filter())), params.orderBy());
          params.total(orderedData.length);
          if(params.total() < (params.page() -1) * params.count()){
            params.page(1);
          }
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      }, { dataset: $scope.data});
    });

      $scope.statusAlert = {newAlert:false, type:"", message:""};


      $scope.saveData = function(){
        $scope.editedViewers = {
            registered: [],
            unregistered: []
        };
        angular.forEach($scope.oldData, function(item) {
            if($scope.checkboxes.items[item._id]){
                if(item.groupsID){
                    $scope.editedViewers.registered.push(item._id);
                    if(!$scope.oldCheckboxes.items[item._id])
                        $scope.newlyAddedVw.push(item);
                }
                else {
                    $scope.editedViewers.unregistered.push(item);
                    if(!$scope.oldCheckboxes.items[item._id])
                        $scope.newlyAddedVw.push(item);
                }
            }
        });
        liveConferences.update({id: $scope.idToEdit,addViewers : true},$scope.editedViewers).$promise.then(function(resp){
            $modalInstance.close();
            $rootScope.$broadcast ('updatedUsers', {newUsers :Success.getObject(resp).viewers , viewers : true, vwToSendNotif : $scope.newlyAddedVw});
        })
    };

      $scope.addViewer = function(isValid){
          if(isValid){
              liveConferences.update({id :$scope.idToEdit, addViewers : true, single: true},$scope.viewer).$promise.then(function(resp){
                  angular.forEach(Success.getObject(resp).viewers.unregistered, function(item) {
                      if(item.username.toLowerCase() == $scope.viewer.username.toLowerCase()){
                          $scope.checkboxes.items[item._id] = true;
                          $scope.data.push(item);
                          if($scope.data.length != $scope.oldData.length)
                              $scope.oldData.push(item);
                      }
                  });
                  $scope.viewer = null;
                  $scope.tableParams.reload();
              }).catch(function(err){
                  $scope.statusAlert.type = "danger";
                  $scope.statusAlert.text = Error.getMessage(err);
                  $scope.statusAlert.newAlert = true;
              });
          } else {
              $scope.statusAlert.type = "danger";
              $scope.statusAlert.text = "Exista campuri goale! Verificati formularul inca o data!";
              $scope.statusAlert.newAlert = true;
          }
      };
  }]);
