controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope','$window','$cookies','Utils', 'CookiesService', 'IntroService', 'Success', 'Error', function ($scope, $state, $modal,$rootScope,$window,$cookies,Utils, CookiesService, IntroService, Success, Error) {

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

    //==================================================================== watch group selection
    $rootScope.$watch('specialGroupSelected',function(){
        if($rootScope.specialGroupSelected)
        {
            var idSelected = $rootScope.specialGroupSelected._id;
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
        }
    });

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