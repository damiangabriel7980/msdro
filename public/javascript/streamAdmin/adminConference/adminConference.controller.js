'use strict';

streamAdminControllers
  .controller('AdminConferenceCtrl', [ '$scope', 'ngTableParams', '$filter', '$sce' , 'liveConferences','$state' , '$rootScope',function ($scope, ngTableParams, $filter, $sce, liveConferences, $state, $rootScope) {
      liveConferences.query().$promise.then(function(resp){
      var data = resp.conferences;
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
    });

    $scope.addConference = function(){
      var conference  = {
        name: 'Untitled',
        description: '',
        location: '',
        image: null,
        date: new Date(),
        therapeuticAreas: [],
        enabled: true
      };
        liveConferences.create(conference).$promise.then(function(resp){
        $state.reload();
      })
    };

    //$scope.editModal = Modal.confirm.edit(function(conference){
    //  adminConference.conferences.update({id: conference._id},conference).$promise.then(function(resp){
    //    $state.reload();
    //  })
    //});
    //
    //
    //$scope.deleteModal = Modal.confirm.delete(function(id){
    //  adminConference.conferences.delete({id: id}).$promise.then(function(resp){
    //    $state.reload();
    //  })
    //});
    //
    //$scope.changeStatus = Modal.confirm.changeStatus(function(id,status){
    //  adminConference.conferences.update({id: id},{isEnabled: status}).$promise.then(function(resp){
    //    $state.reload();
    //  })
    //});

    $scope.deleteConference = function(id){
      $scope.deleteModal(id);
    };

    $scope.statusConference = function(id, confStatus){
      $scope.changeStatus(id,confStatus);
    };

    $scope.editConference = function(conference){
      $scope.sessionData = conference._id;
      $scope.editModal(conference);
    };

  }]);
