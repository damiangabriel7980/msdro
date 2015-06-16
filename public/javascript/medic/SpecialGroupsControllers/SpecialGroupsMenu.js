controllers.controller('SpecialGroupsMenu', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', '$state', '$timeout', 'CollectionsService', function($scope, $rootScope, $stateParams, SpecialFeaturesService, $state, $timeout, CollectionsService){

    SpecialFeaturesService.getSpecialGroups.query().$promise.then(function (resp) {
        if (resp.length != 0) {
            $rootScope.specialGroups = resp;
            if (localStorage.specialGroupSelected) {
                var specialGroup;
                try{
                    specialGroup = angular.fromJson(localStorage.specialGroupSelected);
                }catch(ex){
                    specialGroup = null;
                }
                if(CollectionsService.findById(specialGroup._id, resp)){

                    $scope.selectSpecialGroup(specialGroup);
                }else{

                    $scope.selectSpecialGroup(resp[0]);
                }
            } else {

                $scope.selectSpecialGroup(resp[0]);
            }
        } else {

            $rootScope.specialGroupSelected = null;
            localStorage.removeItem('specialGroupSelected');
        }
    });
    $scope.selectSpecialGroup = function(group){
        if(!$rootScope.specialGroupSelected)
            $rootScope.specialGroupSelected={_id:0};
        if(group._id!= $rootScope.specialGroupSelected._id){

            //select special group and add it to local storage
            $rootScope.specialGroupSelected = group;
            localStorage.specialGroupSelected = angular.toJson(group);

            //load group's product page
            SpecialFeaturesService.getSpecialProducts.query({specialGroup: group._id}).$promise.then(function(result){
                if(result.length!=0)
                    $scope.groupProduct = result;
                else
                    $scope.groupProduct=null;
            });

            //load group's special features (apps)
            SpecialFeaturesService.specialApps.query({group: group._id}).$promise.then(function (resp) {
                if(resp.success){
                    if(resp.success.length > 0){
                        $scope.specialApps = resp.success;
                    }else{
                        $scope.specialApps = null;
                    }
                }else{
                    $scope.specialApps = null;
                }
            });
            if($state.includes('groupFeatures')||$state.includes('groupSpecialProduct')){
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

}]);