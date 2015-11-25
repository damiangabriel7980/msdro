'use strict';

controllers
  .controller('AdminConferenceCtrl', [ '$scope', 'ngTableParams', '$filter', '$sce' , 'liveConferences','$state' , '$rootScope', 'ActionModal', 'Error', '$modal', 'Success',function ($scope, ngTableParams, $filter, $sce, liveConferences, $state, $rootScope,ActionModal, Error,$modal,Success) {
      liveConferences.query().$promise.then(function(resp){
      var data = Success.getObject(resp);
      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
          date: 'desc'     // initial sorting
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
        image_path: null,
        date: new Date(),
        therapeuticAreas: [],
        enabled: true,
          speakers: [],
          viewers: [],
          moderator: {
              email: null,
              name: null
          }
      };
        liveConferences.create(conference).$promise.then(function(resp){
        $state.reload();
      })
    };

    $scope.editConference = function(id){
        $modal.open({
            templateUrl: 'partials/streamAdmin/editConference.html',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve : {
                idToEdit: function () {
                    return id;
                }
            },
            windowClass: 'fade',
            controller:"EditConferenceCtrl"
        });
    };

    $scope.deleteConference = function(id){
        ActionModal.show("Stergere conferinta", "Sunteti sigur ca doriti sa stergeti aceasta conferinta?", function () {
            liveConferences.delete({id: id}).$promise.then(function(resp){
                console.log(resp);
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.statusConference = function(id, confStatus){
        ActionModal.show("Modificare status", "Esti sigur ca vrei sa schimbi status-ul aceastei conferinte ?", function () {
            liveConferences.update({id: id, status: true},{isEnabled: confStatus}).$promise.then(function(resp){
                console.log(resp);
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Update status"
        });
    };

  }]);
