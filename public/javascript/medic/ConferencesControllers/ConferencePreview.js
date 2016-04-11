app.controllerProvider.register('ConferencePreview', ['$scope', '$sce', '$modalInstance', 'conferenceData', '$q', function($scope, $sce, $modalInstance, conferenceData, $q){
	
	var self = this;

	getUserMedia(
		{audio: true, video: true},
		function(stream){
			self.stream = stream;
			$scope.videoUrl = getVideoURL(stream)
		},
		function(err){
			console.log(err);
		}
	)

	$scope.startConference = function(){
		$scope.closeModal(conferenceData.id);
	}

	$scope.closeModal = function(result){
		closeVideoStream()
			.then(function(){
				$modalInstance.close(result);
			})
			.catch(function(err){
				console.log(err);
			});
	}

	function closeVideoStream(){
		var deferred = $q.defer();
		var tracks = self.stream.getTracks();
		for(var i=0; i<tracks.length; i++){
			tracks[i].stop();
		}
		deferred.resolve();
		return deferred.promise;
	}

	function getVideoURL(stream){
      if (window.URL) {
        return $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
      } else {
        return $sce.trustAsResourceUrl(stream);
      }
    }

}]);