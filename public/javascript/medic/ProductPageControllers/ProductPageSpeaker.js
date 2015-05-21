controllers.controller('ProductPageSpeaker', ['$scope', '$stateParams', 'specialProductService', function($scope, $stateParams, specialProductService){

    specialProductService.speakers.query({speaker_id: $stateParams.speaker_id}).$promise.then(function(resp){
        $scope.speaker = resp.success;
    });

}]);