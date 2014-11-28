cloudAdminControllers.controller('SpecialGroupsMenuController', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state){

    SpecialFeaturesService.getSpecialGroups.query().$promise.then(function (resp) {
        console.log(resp);
        $rootScope.specialGroups = resp;
        if(sessionStorage.specialGroupSelected){
            $rootScope.specialGroupSelected = angular.fromJson(sessionStorage.specialGroupSelected);
        }else{
            $rootScope.specialGroupSelected = resp[0];
        }
    });

    $scope.selectSpecialGroup = function(group){
        var currentGroup = sessionStorage.specialGroupSelected?angular.fromJson(sessionStorage.specialGroupSelected):null;
        if(currentGroup){
            if(currentGroup._id !== group._id){
                sessionStorage.specialGroupSelected = angular.toJson(group);
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
            }
        }
    };

}]);