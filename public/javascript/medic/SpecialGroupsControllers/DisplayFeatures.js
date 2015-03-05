controllers.controller('DisplayFeatures', ['$scope', '$rootScope', '$stateParams', '$sce', 'SpecialFeaturesService', function($scope, $rootScope, $stateParams, $sce, SpecialFeaturesService){

    //get feature url
    SpecialFeaturesService.specialApps.query({id: $stateParams.specialApp}).$promise.then(function (resp) {
        if(resp.success){
            $scope.featureSrc = $sce.trustAsResourceUrl(resp.success.url);
        }
    })

}]);