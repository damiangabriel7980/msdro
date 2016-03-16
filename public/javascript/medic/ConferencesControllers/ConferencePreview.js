app.controllerProvider.register('ConferencePreview', ['$scope', '$modalInstance', 'videoUrl', 'conferenceData', function($scope, $modalInstance, videoUrl, conferenceData){
	$scope.videoUrl = videoUrl;

	$scope.startConference = function(){
		$modalInstance.close(conferenceData.id);
	}
}]);