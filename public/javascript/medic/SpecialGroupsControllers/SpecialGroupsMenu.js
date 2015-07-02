controllers.controller('SpecialGroupsMenu', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', '$timeout', 'CollectionsService', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state, $timeout, CollectionsService){

    SpecialFeaturesService.SpecialGroups.query().$promise.then(function (resp) {
        if (resp.success.length != 0) {
            $rootScope.specialGroups = resp.success;
            var selectedGroup = SpecialFeaturesService.specialGroups.getSelected();
            if (selectedGroup) {
                if(CollectionsService.findById(selectedGroup._id, resp.success)){
                    $scope.selectSpecialGroup(selectedGroup);
                }else{
                    $scope.selectSpecialGroup(resp.success[0]);
                }
            } else {
                $scope.selectSpecialGroup(resp.success[0]);
            }
        }else{
            $scope.unselectSpecialGroup();
        }
    });
    $scope.selectSpecialGroup = function(group){
        var idSelected = 0;
        if($rootScope.specialGroupSelected && $rootScope.specialGroupSelected._id) idSelected = $rootScope.specialGroupSelected._id;
        if(group._id != idSelected){

            //select special group and add it to local storage
            $rootScope.specialGroupSelected = group;
            SpecialFeaturesService.specialGroups.setSelected(group);

            //load group's product page
            SpecialFeaturesService.SpecialProducts.query({specialGroup: group._id}).$promise.then(function(result){
                if(result.success.length!=0){
                    $scope.groupProduct = result.success;
                }else{
                    $scope.groupProduct = null;
                }
            });

            //load group's special features (apps)
            SpecialFeaturesService.specialApps.query({group: group._id}).$promise.then(function (resp) {
                if(resp.success && resp.success.length > 0){
                    $scope.specialApps = resp.success;
                }else{
                    $scope.specialApps = null;
                }
            });
            if($state.includes('groupFeatures') || $state.includes('groupSpecialProduct')){
                //if user changed his group while being on a feature page or product page, redirect him to home
                $state.go('home');
            }else{
                //if he changed his group while being on another page, just reload the page
                var reloadState = function () {
                    try {
                        $state.reload();
                    } catch (ex) {
                        $timeout(reloadState, 300);
                    }
                };
                reloadState();
            }
        }

    };
    $scope.unselectSpecialGroup = function () {
        $rootScope.specialGroupSelected = null;
        SpecialFeaturesService.specialGroups.setSelected(null);
    };

}]);