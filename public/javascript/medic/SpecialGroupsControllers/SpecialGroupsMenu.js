controllers.controller('SpecialGroupsMenu', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state){

    SpecialFeaturesService.getSpecialGroups.query().$promise.then(function (resp) {
        var modalGroups={};
        $rootScope.specialGroups = resp;
        for(var i=0;i<$rootScope.specialGroups.length;i++)
        {
            modalGroups[$rootScope.specialGroups[i]._id]=true;
            console.log(modalGroups);
        }
        //if(sessionStorage.statusModalGroups)
        //    sessionStorage.removeItem('statusModalGroups');
        sessionStorage.setItem('statusModalGroups',JSON.stringify(modalGroups));
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
        //sessionStorage.setItem(group._id,false);
        SpecialFeaturesService.getSpecialProducts.query({specialGroup: group._id}).$promise.then(function(result){
            if(result._id)
                $scope.groupProduct = result;
            else
                $scope.groupProduct=null;
        });
        $rootScope.specialGroupSelected = group;
        localStorage.specialGroupSelected = angular.toJson(group);
       //load group features into array. use "DisplayFeatureController" to establish paths for them
        switch(group.display_name){
            case "MSD Diabetes": $scope.groupFeatures = ["Januvia"];
                break;
            //case "Immunology": $scope.groupFeatures = [];
            //    break;
            default: $scope.groupFeatures = null;
                break;
        }
        if($state.includes('groupFeatures')||$state.includes('groupSpecialProduct')){
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
    };



}]);