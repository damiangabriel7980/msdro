controllers.controller('DisplayFeatures', ['$scope', '$rootScope', '$stateParams', '$sce', 'SpecialFeaturesService', 'Success', 'Error', function($scope, $rootScope, $stateParams, $sce, SpecialFeaturesService, Success, Error){

    //get feature url
    SpecialFeaturesService.specialApps.query({id: $stateParams.specialApp}).$promise.then(function (resp) {
        if(Success.getObject(resp)){
            $scope.featureSrc = $sce.trustAsResourceUrl(Success.getObject(resp).url);
        }
    });

}]);