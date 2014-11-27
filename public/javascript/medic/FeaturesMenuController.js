cloudAdminControllers.controller('FeaturesMenuController', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', function($scope, $rootScope, $stateParams, SpecialFeaturesService){

    //TODO: Get features for current user -> $rootScope.groupFeatures
    SpecialFeaturesService.getSpecialGroups.query().$promise.then(function (resp) {
        console.log(resp);
        $rootScope.specialGroups = resp;
        if(resp[0]){
            $rootScope.specialGroupSelected = resp[0];
        }
    });
}]);