'use strict';

controllers
  .controller('EditViewersCtrl', [ '$scope', '$filter', '$sce' ,'$state' , '$rootScope', 'userService', 'ngTableParams', 'Success', 'Error', 'getIds', 'liveConferences', 'filterArrayProperty', function ($scope, $filter, $sce, $state, $rootScope,userService, ngTableParams,Success,Error,getIds,liveConferences,filterArrayProperty) {
    $scope.selectedGroup = {
      display_name: '',
      _id: null
    };

    userService.groups.query().$promise.then(function(resp){
      $scope.groups = Success.getObject(resp);
    });

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

    $scope.checkboxes = { 'checked': false, items: {} };

    $scope.selectAll = function(value) {
      angular.forEach($scope.data, function(item) {
        $scope.checkboxes.items[item._id] = value;
      });
    };

    // watch for data checkboxes
    $scope.$watch('checkboxes.items', function(values) {
      if (!$scope.data) {
        return;
      }
      var checked = 0, unchecked = 0,
          total = $scope.data.length;
      angular.forEach($scope.data, function(item) {
        checked   +=  ($scope.checkboxes.items[item._id]) || 0;
        unchecked += (!$scope.checkboxes.items[item._id]) || 0;
      });
      if ((unchecked == 0) || (checked == 0)) {
        $scope.checkboxes.checked = (checked == total);
      }
    }, true);

    userService.users.query({groups: true}).$promise.then(function(resp){
      //$scope.viewers = viewersToEdit;
      $scope.data = Success.getObject(resp);
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

    };


  }]);
