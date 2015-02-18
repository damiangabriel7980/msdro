cloudAdminControllers.controller('SpecialGroupsMenuController', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state){

    SpecialFeaturesService.getSpecialGroups.query().$promise.then(function (resp) {
        $rootScope.specialGroups = resp;
        console.log(resp);
        if (resp.length != 0) {
            $rootScope.specialGroups = resp;
            if (localStorage.specialGroupSelected) {
                var specialGroup;
                try{
                    specialGroup = angular.fromJson(localStorage.specialGroupSelected);
                }catch(ex){
                    specialGroup = null;
                }
                if(checkGroupInGroups(specialGroup, resp)){
                    console.log("special group found");
                    console.log(specialGroup);
                    $scope.selectSpecialGroup(specialGroup);
                }else{
                    console.log("special group found in storage, but not on user");
                    $scope.selectSpecialGroup(resp[0]);
                }
            } else {
                console.log("special group not found");
                $scope.selectSpecialGroup(resp[0]);
            }
        } else {
            console.log("no special groups");
            $rootScope.specialGroupSelected = null;
            localStorage.removeItem('specialGroupSelected');
        }
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    $scope.selectSpecialGroup = function(group){
        SpecialFeaturesService.getSpecialProducts.query({specialGroup: group._id}).$promise.then(function(result){
            $scope.groupProduct = result;
        });
        $rootScope.specialGroupSelected = group;
        localStorage.specialGroupSelected = angular.toJson(group);
        //load group features into array. use "DisplayFeatureController" to establish paths for them
        switch(group.display_name){
            case "MSD Diabetes": $scope.groupFeatures = ["Januvia"];
                break;
            default: $scope.groupFeatures = null;
                break;
        }
        if($state.includes('groupFeatures')){
            //if user changed his group while being on a feature page, redirect him to home
            $state.go('home');
        }else{
            //if he changed his group while being on another page, just reload the page
            $state.reload();
        }
    };

    var checkGroupInGroups = function (group, groups) {
        var i=0;
        try{
            while(i<groups.length){
                if(groups[i]._id == group._id){
                    return true;
                }
                i++;
            }
            return false;
        }catch(ex){
            return false;
        }
    }

}]);