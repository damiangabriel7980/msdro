app.controllerProvider.register('ConferencePreview', ['$scope', '$sce', '$modalInstance', 'conferenceData', function($scope, $sce, $modalInstance, conferenceData){
	getUserMedia(
		{audio: true, video: true},
		function(stream){
			$scope.videoUrl = getVideoURL(stream)
		},
		function(err){
			console.log(err);
		}
	)

	$scope.startConference = function(){
		$modalInstance.close(conferenceData.id);
	}

	function getVideoURL(stream){
      if (window.URL) {
        return $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
      } else {
        return $sce.trustAsResourceUrl(stream);
      }
    }

}]);