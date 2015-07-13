controllers.controller('SpecialGroupsMenu', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', '$timeout', 'CollectionsService', 'Success', 'Error', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state, $timeout, CollectionsService, Success, Error){

    //get available groups
    SpecialFeaturesService.specialGroups.getAll().then(function (groups) {
        //console.log(groups);
        $scope.specialGroups = groups;
    });

    //getSelectedGroup
    SpecialFeaturesService.specialGroups.getSelected().then(function (group) {
        //console.log(group);
        $scope.specialGroupSelected = group;
    });

    $scope.selectSpecialGroup = function(group){
        SpecialFeaturesService.specialGroups.setSelected(group._id);
        $scope.specialGroupSelected = group;
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
    };

}]);