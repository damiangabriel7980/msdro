'use strict';

controllers
  .controller('EditViewersCtrl', [ '$scope', '$filter', '$sce' ,'$state' , '$rootScope', 'userService', 'ngTableParams', 'Success', 'Error', 'getIds', 'liveConferences', 'filterArrayProperty', '$modalInstance', 'idToEdit', 'viewersToEdit', function ($scope, $filter, $sce, $state, $rootScope,userService, ngTableParams,Success,Error,getIds,liveConferences,filterArrayProperty,$modalInstance,idToEdit, viewersToEdit) {
    $scope.selectedGroup = {
      display_name: '',
      _id: null
    };

    userService.groups.query().$promise.then(function(resp){
      $scope.groups = Success.getObject(resp);
    });

      $scope.checkboxes = { 'checked': false, items: {} };

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
        $scope.checkboxes.items[item._id] = value;
      });
    };

    // watch for data checkboxes
    $scope.checkValue = function(id,value,viewer){
        if(!value){
            delete $scope.checkboxes.items[id];
            if(viewer.groupsID){
                angular.forEach($scope.editedViewers.registered, function(item,index) {
                    if(item._id == id)
                        $scope.editedViewers.registered.splice(index,1);
                });
            } else {
                angular.forEach($scope.editedViewers.unregistered, function(item,index) {
                    if(item._id == id)
                        $scope.editedViewers.unregistered.splice(index,1);
                });
            }
        } else {
            if(viewer.groupsID){
                $scope.editedViewers.registered.push(viewer);
            } else {
                $scope.editedViewers.unregistered.push(viewer);
            }
        }
    };

    userService.users.query({groups: true}).$promise.then(function(resp){
      //$scope.viewers = viewersToEdit;
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
        $scope.oldData = Success.getObject(resp);
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

    $scope.saveData = function(){
        $scope.editedViewers.registered = getIds.extract($scope.editedViewers.registered);
        liveConferences.update({id: $scope.idToEdit,addViewers : true},$scope.editedViewers).$promise.then(function(resp){
            $modalInstance.close();
            $rootScope.$broadcast ('updatedUsers', {newUsers :Success.getObject(resp).viewers , viewers : true});
        })
    };

      $scope.addViewer = function(){
          liveConferences.update({id :$scope.idToEdit, addViewers : true, single: true},$scope.viewer).$promise.then(function(resp){
                angular.forEach(Success.getObject(resp).viewers.unregistered, function(item) {
                    if(item.username.toLowerCase() == $scope.viewer.username.toLowerCase()){
                        $scope.checkboxes.items[item._id] = true;
                        $scope.data.push(item);
                    }
                });
                $scope.viewer = null;
            })
      };

  }]);
