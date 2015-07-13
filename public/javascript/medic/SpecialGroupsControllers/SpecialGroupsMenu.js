controllers.controller('SpecialGroupsMenu', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', 'IntroService', '$state', '$timeout', 'CollectionsService', 'Success', 'Error', function($scope, $rootScope, $stateParams, SpecialFeaturesService, IntroService, $state, $timeout, CollectionsService, Success, Error){

    //get available groups
    SpecialFeaturesService.specialGroups.getAll().then(function (groups) {
        //console.log(groups);
        $scope.specialGroups = groups;
    });

    //getSelectedGroup
    SpecialFeaturesService.specialGroups.getSelected().then(function (group) {
        //console.log(group);
        $scope.specialGroupSelected = group;
        if(group){
            handleIntro(group._id);
            loadSpecialProductPage(group._id);
            loadSpecialGroupFeatures(group._id);
        }
    });

    $scope.selectSpecialGroup = function(group){
        SpecialFeaturesService.specialGroups.setSelected(group._id);
        $scope.specialGroupSelected = group;
        handleIntro(group._id);
        loadSpecialProductPage(group._id);
        loadSpecialGroupFeatures(group._id);
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

    var handleIntro = function (idSelected) {
        //check if user opted to hide this intro video
        var hideVideo = IntroService.hideNextTime.getStatus(idSelected);
        console.log(hideVideo);
        if(!hideVideo){
            //if not, check if this intro video is enabled
            IntroService.checkIntroEnabled.query({groupID: idSelected}).$promise.then(function (resp) {
                if(Success.getObject(resp).enabled){
                    //if so, check if user already viewed the video in this log in session
                    IntroService.rememberIntroView.query({groupID: idSelected}).$promise.then(function (resp) {
                        console.log(Success.getObject(resp));
                        if(!Success.getObject(resp).isViewed){
                            //if not, mark as viewed
                            IntroService.rememberIntroView.save({groupID: idSelected}).$promise.then(function () {
                                //then show it
                                $rootScope.showIntroPresentation(idSelected);
                            });
                        }
                    });
                }
            });
        }
    };

    var loadSpecialProductPage = function (idSelected) {
        //load group's product page
        SpecialFeaturesService.SpecialProducts.query({specialGroup: idSelected}).$promise.then(function(result){
            if(Success.getObject(result).length!=0){
                $scope.groupProduct = Success.getObject(result);
            }else{
                $scope.groupProduct = null;
            }
        });
    };

    var loadSpecialGroupFeatures = function (idSelected) {
        //load group's special features (apps)
        SpecialFeaturesService.specialApps.query({group: idSelected}).$promise.then(function (resp) {
            if(Success.getObject(resp) && Success.getObject(resp).length > 0){
                $scope.specialApps = Success.getObject(resp);
            }else{
                $scope.specialApps = null;
            }
        });
    };

}]);