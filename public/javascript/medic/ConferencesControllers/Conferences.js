app.controllerProvider.register('Conferences', ['$scope', '$http', 'ConferenceService', '$sce', '$rootScope', '$state', '$modal', function ($scope, $http, ConferenceService, $sce,$rootScope, $state, $modal){
	$scope.today = new Date();
    var futureDate = new Date().setMonth($scope.today.getMonth() + 2);

    //static list of Conferences
    ConferenceService.all.query().$promise.then(
      function(resp){
        $scope.listOfConferences = resp;
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
              previewConference(conf._id);
            }else{
              $scope.startConference(conf._id);
            }
          }else{
            console.log("This should not have happened");
          }
        }
      );
    };

    $scope.startConference = function(conferenceId){
      console.log("Start conference: "+conferenceId);
      window.open('/conference?id='+conferenceId, 'conferenceWindow', 'width=200, height=100');
      //conference.join(conf._id);
    }

    function previewConference(conferenceId){
    	getUserMedia(
    		{audio: true, video: true},
    		function(stream){
    			$modal.open({
    				templateUrl: 'partials/medic/elearning/conferencePreview.html',
    				windowClass: 'fade',
    				controller: 'ConferencePreview',
    				resolve: {
    				    videoUrl: getVideoURL(stream),
                parentScope: $scope,
    				    conferenceData: {
                  id: conferenceId
                }
    				}
    			});
    		},
    		function(err){
    			console.log(err);
    		}
    	)
    }

    function getVideoURL(stream){
      if (window.URL) {
        return $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
      } else {
        return $sce.trustAsResourceUrl(stream);
      }
    }

}]);