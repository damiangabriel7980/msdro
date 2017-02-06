controllers.controller('SpecialGroupsMenu', ['$scope', '$rootScope', '$stateParams', 'SpecialFeaturesService', 'IntroService', '$state', '$timeout', 'CollectionsService', 'Success', 'Error', 'PathologiesService', 'specialProductService', 'medicCostsService', function($scope, $rootScope, $stateParams, SpecialFeaturesService, IntroService, $state, $timeout, CollectionsService, Success, Error, PathologiesService, specialProductService, medicCostsService){

    //get available groups
    SpecialFeaturesService.specialGroups.getAll().then(function (groups) {
        //console.log(groups);
        $scope.specialGroups = groups;
    });

    PathologiesService.pathologies.query({forDropdown: true}).$promise.then(function(resp){
        $scope.pathologies = Success.getObject(resp).length > 0 ? Success.getObject(resp): null;
    });

    medicCostsService.users.query().$promise.then(function (resp) {
        $scope.medicCosts = Success.getObject(resp).length > 0 ? Success.getObject(resp) : null;
    });

    specialProductService.SpecialProduct.query().$promise.then(function (result) {
        $scope.pathologiesWithProducts = Success.getObject(result).length > 0 ? Success.getObject(result) : null;
        if ($scope.pathologiesWithProducts)
            $scope.pathologiesWithProducts.unshift({_id: 0, display_name: 'Toate produsele'})
    });

    //get Default Group
    SpecialFeaturesService.defaultPharma.query().$promise.then(function(resp){
        $scope.defaultGroup= Success.getObject(resp);
        if($scope.defaultGroup.display_name == "Farmacist")
            $rootScope.showFarmaWidget = true;
        else
            $rootScope.showFarmaWidget = false;
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
        loadSpecialGroupFeatures();
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
                    IntroService.rememberIntroView.query({groupID: idSelected, cache: new Date()}).$promise.then(function (resp) {
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
        SpecialFeaturesService.specialApps.query().$promise.then(function (resp) {
            if(Success.getObject(resp) && Success.getObject(resp).length > 0){
                $scope.specialApps = Success.getObject(resp);
            }else{
                $scope.specialApps = null;
            }
        });
    };

}]);