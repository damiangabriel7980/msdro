controllers.controller('ProductPageSpeaker', ['$scope', '$stateParams', 'specialProductService', 'Success', 'Error', function($scope, $stateParams, specialProductService, Success, Error){

    specialProductService.speakers.query({speaker_id: $stateParams.speaker_id}).$promise.then(function(resp){
        $scope.speaker = Success.getObject(resp);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

}]);