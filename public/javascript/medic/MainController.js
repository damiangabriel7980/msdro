controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope','$window','$cookies','Utils', 'CookiesService', 'IntroService', 'SpecialFeaturesService', 'Success', 'Error', function ($scope, $state, $modal,$rootScope,$window,$cookies,Utils, CookiesService, IntroService, SpecialFeaturesService, Success, Error) {

    //===================================================================== navigation
    $scope.goToMerckSite=function(){
        $window.open('http://www.merckmanuals.com/','_blank');
    };
    $scope.logoutUser=function(){
        $window.location.href='logout';
    };

    //===================================================================== user accepts cookies
    var acceptedCookies = CookiesService.getCookie("MSDCookies");
    $scope.isCollapsed = (acceptedCookies == 'yes');

    $scope.setCookie=function(){
        CookiesService.setCookie('MSDCookies','yes');
        $scope.isCollapsed=true;
    };

    //==================================================================== get special groups related content
    SpecialFeaturesService.specialGroups.getSelected().then(function (specialGroupSelected) {
        if(specialGroupSelected){
            var idSelected = specialGroupSelected._id;
            handleIntro(idSelected);
            loadSpecialProductPage(idSelected);
            loadSpecialGroupFeatures(idSelected);
        }
    });

    var handleIntro = function (idSelected) {
        //check if user opted to hide this intro video
        var hideVideo = IntroService.hideNextTime.getStatus(idSelected);
        if(!hideVideo){
            //if not, check if this intro video is enabled
            IntroService.checkIntroEnabled.query({groupID: idSelected}).$promise.then(function (resp) {
                if(Success.getObject(resp).enabled){
                    //if so, check if user already viewed the video in this log in session
                    IntroService.rememberIntroView.query({groupID: idSelected}).$promise.then(function (resp) {
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

    //==================================================================== special groups drop-down

    $scope.showFarmaModal = function () {
        return $rootScope.showPDFModal('Pharma');
    };
    $scope.showTermsModal = function () {
        return $rootScope.showPDFModal('Terms');
    };
    $scope.showMerckManual = function () {
        return $rootScope.showPDFModal('MerckManual');
    };

    $scope.showContactModal = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/contact.html',
            size: 'lg',
            windowClass: 'fade'
        });
    };

    //============================================ profile modal

    var openProfileModal = function () {
        $modal.open({
            templateUrl: 'partials/medic/profile.html',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'fade modal-responsive MyProfileModal',
            controller: 'Profile',
            resolve: {
                loadDeps: loadStateDeps(['Profile', 'Ui-select', 'FileUpload', 'TherapeuticSelect'])
            }
        });
    };
    $scope.showProfile = function(){
        if(Utils.isMobile(false,true)['iosDev'] || Utils.isMobile(false,true)['androidDetect'])
        {
            if(Utils.isMobile(false,true)['isIpad'] || Utils.isMobile(false,true)['androidTab'])
            {
                openProfileModal();
            }
            else{
                    $state.go('profileMobile');
            }
        }
        else{
            openProfileModal();
        }
    };
    $scope.navCollapsed = true;
    $scope.searchText = function(data){
        if(data==="")
            return;
        else{
            $state.go('homeSearch',{textToSearch : data},{reload: true});
            $scope.closeNavbar();
        }
    };
    $scope.closeNavbar = function () {
        $scope.navCollapsed = true;
    };
    $scope.toggleNavbar = function () {
        $scope.navCollapsed = !$scope.navCollapsed;
    };
    $scope.openNavbar = function () {
        $scope.navCollapsed = false;
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.closeNavbar();
    });

}]);