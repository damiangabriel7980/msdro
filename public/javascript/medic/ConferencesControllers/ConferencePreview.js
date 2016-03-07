app.controllerProvider.register('ConferencePreview', ['$scope', 'videoUrl', 'conferenceDetails', function($scope, videoUrl, conferenceDetails){
	$scope.videoUrl = videoUrl;

	$scope.startConference = function(){
		console.log("Start conference: "+conferenceDetails.id);
	}
}]);