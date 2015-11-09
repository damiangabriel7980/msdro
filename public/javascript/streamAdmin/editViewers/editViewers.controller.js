'use strict';

streamAdminControllers
  .controller('EditViewersCtrl', [ '$scope', '$filter', '$sce' ,'$state' , '$rootScope', 'user', 'ngTableParams', function ($scope, $filter, $sce, $state, $rootScope,user, ngTableParams) {
    $scope.selectedViewer = {
      name: '',
      _id: 0
    };

    //console.log($scope.modal.idToEdit);

    user.confUsers.query().$promise.then(function(resp){
      var data = resp.users;
      $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
          name: 'asc'     // initial sorting
        },
        filter: {
          name: ''       // initial filter
        }
      }, {
        total: data.length, // length of data
        getData: function($defer, params) {

          var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());
          params.total(orderedData.length);
          if(params.total() < (params.page() -1) * params.count()){
            params.page(1);
          }
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      }, { dataset: data});
    })
  }]);
