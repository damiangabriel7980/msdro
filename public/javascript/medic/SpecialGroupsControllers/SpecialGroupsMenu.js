controllers.controller('SpecialGroupsMenu', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', '$timeout', 'CollectionsService', 'Success', 'Error', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state, $timeout, CollectionsService, Success, Error){

    SpecialFeaturesService.SpecialGroups.query().$promise.then(function (resp) {
        var groups = Success.getObject(resp);
        if (groups.length != 0) {
            $rootScope.specialGroups = groups;
            var selectedGroup = SpecialFeaturesService.specialGroups.getSelected();
            if (selectedGroup) {
                if(CollectionsService.findById(selectedGroup._id, groups)){
                    $scope.selectSpecialGroup(selectedGroup);
                }else{
                    $scope.selectSpecialGroup(groups[0]);
                }
            } else {
                $scope.selectSpecialGroup(groups[0]);
            }
        }else{
            $scope.unselectSpecialGroup();
        }
    }).catch(function(err){
        console.log(Error.getMessage(err));
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
                if(Success.getObject(result).length!=0){
                    $scope.groupProduct = Success.getObject(result);
                }else{
                    $scope.groupProduct = null;
                }
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });

            //load group's special features (apps)
            SpecialFeaturesService.specialApps.query({group: group._id}).$promise.then(function (resp) {
                if(Success.getObject(resp) && Success.getObject(resp).length > 0){
                    $scope.specialApps = Success.getObject(resp);
                }else{
                    $scope.specialApps = null;
                }
            }).catch(function(err){
                console.log(Error.getMessage(err));
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