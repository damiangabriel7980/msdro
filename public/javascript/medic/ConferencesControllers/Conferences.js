app.controllerProvider.register('Conferences', ['$scope', '$http', 'ConferenceService', '$rootScope', '$state', '$modal', function ($scope, $http, ConferenceService,$rootScope, $state, $modal){
	$scope.today = new Date();
    var futureDate = new Date().setMonth($scope.today.getMonth() + 2);

    //static list of Conferences
    var displayedConferences = [];
    ConferenceService.all.query().$promise.then(
      function(conferences){
        async.each(conferences, function getConferenceStatus(conference, callback){
          ConferenceService.status.query({id: conference._id}).$promise
            .then(function(resp){
              conference.status = (resp||{}).status;
              displayedConferences.push(conference);
              callback();
            })
            .catch(function(err){
              callback(err);
            })
        }, function gotAllStatuses(err){
          if(err){
            console.log(err);
          }else{
            console.log(displayedConferences);
            $scope.listOfConferences = displayedConferences;
          }
        })
      }
    ).catch(function(err){
      console.log(err);
    });

    /**
     * initializes a call
     */
    $scope.call = function(conf){
      ConferenceService.role.query({id: conf._id}).$promise.then(
        function(data){
          var role = data.role;
          if(role){
          	console.log("Role: "+role);
            if(role === "speaker"){
              //we should show a preview if the conference is live
              ConferenceService.status.query({id: conf._id}).$promise
                .then(function(data){
                  if(data.status === "live"){
                    previewConference(conf._id);
                  }else{
                    startConference(conf._id);
                  }
                })
                .catch(function(err){
                  console.log(err);
                })
            }else{
              startConference(conf._id);
            }
          }else{
            console.log("This should not have happened");
          }
        }
      );
    };

    var startConference = function(conferenceId){
      console.log("Start conference: "+conferenceId);
      //first we need to calculate our window dimensions and position
      var width = window.innerWidth * 0.66 ;
      var height = width * window.innerHeight / window.innerWidth ;
      var top = (window.innerHeight - height) / 2;
      var left = (window.innerWidth - width) / 2;
      //open the window
      window.open('/conference?id='+conferenceId, 'conferenceWindow', 'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
      //conference.join(conf._id);
    }

    function previewConference(conferenceId){
      $modal.open({
        templateUrl: 'partials/medic/elearning/conferencePreview.html',
        windowClass: 'fade',
        controller: 'ConferencePreview',
        backdrop: 'static',
        resolve: {
            conferenceData: {
              id: conferenceId
            }
        }
      }).result.then(function(conferenceId){
        if(conferenceId){
          startConference(conferenceId);
        }
      });
    }

}]);