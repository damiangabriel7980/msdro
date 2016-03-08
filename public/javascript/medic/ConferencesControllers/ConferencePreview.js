app.controllerProvider.register('ConferencePreview', ['$scope', 'videoUrl', 'parentScope', 'conferenceData', function($scope, videoUrl, parentScope, conferenceData){
	$scope.videoUrl = videoUrl;

	$scope.startConference = function(){
		parentScope.startConference(conferenceData.id);
	}
}]);