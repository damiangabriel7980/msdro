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

    //========================================================================================= intro modals
    var showIntroPresentation = function (groupID) {
        $modal.open({
            templateUrl: 'partials/medic/modals/presentationModal.html',
            keyboard: false,
            backdrop: 'static',
            windowClass: 'fade',
            controller: 'PresentationModal',
            resolve: {
                groupID: function () {
                    return groupID;
                }
            }
        });
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
                    if(Success.getObject(resp)){
                        //if so, check if user already viewed the video in this log in session
                        IntroService.rememberIntroView.query({groupID: idSelected}).$promise.then(function (resp) {
                            if(Success.getObject(resp)){
                                if(!Success.getObject(resp).isViewed){
                                    //if not, show it
                                    showIntroPresentation(idSelected);
                                    //and mark as viewed (async)
                                    IntroService.rememberIntroView.save({groupID: idSelected});
                                }
                            }
                        }).catch(function(err){
                            console.log(Error.getMessage(err));
                        });
                    }
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }
        }
    });

    //==================================================================== special groups drop-down
    $scope.showFarmaModal = function() {
        if(Utils.isMobile(false,true)['iosDetect'])
            window.open($rootScope.Pharma);
        else {
            var modalInstance = $modal.open({
                templateUrl: 'partials/medic/modals/Farma.html',
                keyboard: false,
                size: 'lg',
                windowClass: 'fade modal-responsive',
                backdrop: 'static'
            });
        }
    };

    $scope.showContactModal = function(){
        if(Utils.isMobile(false,true)['iosDetect']){
            window.open($rootScope.Pharma);
        }else{
            $modal.open({
                templateUrl: 'partials/medic/modals/contact.html',
                size: 'lg',
                windowClass: 'fade'
            });
        }
    };

    $scope.showTermsModal = function(){
        if(Utils.isMobile(false,true)['iosDetect'])
            window.open($rootScope.Terms);
        else {
            $modal.open({
                templateUrl: 'partials/medic/modals/Terms.html',
                size: 'lg',
                windowClass: 'fade modal-responsive',
                backdrop: 'static',
                keyboard: false
            });
        }
    };

    //merck modal
    $scope.showMerckManual = function(){
        if(Utils.isMobile(false,true)['iosDetect'])
            window.open($rootScope.MerckManual);
        else{
            $modal.open({
                templateUrl: 'partials/medic/modals/merckManual.html',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                windowClass: 'fade modal-responsive'
            });
        }
    };

    //============================================ profile modal

    var openProfileModal = function () {
        $modal.open({
            templateUrl: 'partials/medic/profile.html',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'fade modal-responsive MyProfileModal',
            controller: 'Profile'
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
        console.log(data);
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
    $scope.openNavbar = function () {
        $scope.navCollapsed = false;
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.closeNavbar();
    });

}]);