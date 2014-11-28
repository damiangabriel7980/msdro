cloudAdminControllers.controller('SpecialGroupsMenuController', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state){

    SpecialFeaturesService.getSpecialGroups.query().$promise.then(function (resp) {
        console.log(resp);
        if(resp.length != 0){
            $rootScope.specialGroups = resp;
            if(sessionStorage.specialGroupSelected){
                console.log("gs");
                $scope.selectSpecialGroup(angular.fromJson(sessionStorage.specialGroupSelected));
            }else{
                console.log("gns");
                $scope.selectSpecialGroup(resp[0]);
            }
        }else{
            $rootScope.specialGroupSelected = null;
            sessionStorage.specialGroupSelected = null;
        }
    });

    $scope.selectSpecialGroup = function(group){
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
    };

}]);