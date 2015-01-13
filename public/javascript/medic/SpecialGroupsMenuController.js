cloudAdminControllers.controller('SpecialGroupsMenuController', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state){

    SpecialFeaturesService.getSpecialGroups.query().$promise.then(function (resp) {
        if(resp.length != 0){
            $rootScope.specialGroups = resp;
            $scope.selectSpecialGroup(resp[0]);
        }else{
            $rootScope.specialGroupSelected = null;
            sessionStorage.specialGroupSelected = null;
        }
    });

    $scope.selectSpecialGroup = function(group){
        $rootScope.specialGroupSelected = group;
        //load group features into array. use "DisplayFeatureController" to establish paths for them
        switch(group.display_name){
            case "MSD Diabetes": $scope.groupFeatures = ["Januvia"]; break;
            default: $scope.groupFeatures = null; break;
        }
        if($state.includes('groupFeatures')){
            //if user changed his group while being on a feature page, redirect him to home
            $state.go('home');
        }else{
            //if he changed his group while being on another page, just reload the page
            $state.reload();
        }
    };

}]);