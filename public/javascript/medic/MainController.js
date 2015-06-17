controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope','$window','$cookies','Utils', 'CookiesService', 'IntroService', function ($scope, $state, $modal,$rootScope,$window,$cookies,Utils, CookiesService, IntroService) {

    //===================================================================== navigation
    $scope.goToMerckSite=function(){
        $window.open('http://www.merckmanuals.com/','_blank');
    };
    $scope.logoutUser=function(){
        $window.location.href='logout';
    };
    $scope.goToPharma=function(){
        $window.open($rootScope.Pharma,'_tab');
    };
    $scope.goToTerms=function(){
        $window.open($rootScope.Terms,'_tab');
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
                    if(resp.success){
                        //if so, check if user already viewed the video in this log in session
                        IntroService.rememberIntroView.query({groupID: idSelected}).$promise.then(function (resp) {
                            if(resp.success){
                                console.log(resp.success.isViewed);
                                if(!resp.success.isViewed){
                                    //if not, show it
                                    showIntroPresentation(idSelected);
                                    //and mark as viewed (async)
                                    IntroService.rememberIntroView.save({groupID: idSelected});
                                }
                            }
                        });
                    }
                });
            }
        }
    });

    //==================================================================== special groups drop-down
    $scope.specialCollapsed = true;
    $scope.collapseAndStyle = function(forClose){
        if(!forClose)
        {
            if(!angular.element('#normalMenuMobile').hasClass('menuShadow')) {
                angular.element('#normalMenuMobile').addClass('menuShadow');
                $scope.specialCollapsed = false;
            }
        }
        else{
            if(angular.element('#normalMenuMobile').hasClass('menuShadow'))
            {
                angular.element('#normalMenuMobile').removeClass('menuShadow');
                $scope.specialCollapsed = true;
            }
        }
    };
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
        $modal.open({
            templateUrl: 'partials/medic/modals/contact.html',
            size: 'lg',
            windowClass: 'fade'
        });
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
    $scope.goToMerckManual=function(){
        window.open($rootScope.MerckManual,'_blank');
    };

    //profile modal
    $scope.showProfile = function(){
        if(Utils.isMobile(false,true)['iosDev'] || Utils.isMobile(false,true)['androidDetect'])
        {
            if(Utils.isMobile(false,true)['isIpad'] || Utils.isMobile(false,true)['androidTab'])
            {
                $modal.open({
                    templateUrl: 'partials/medic/profile.html',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'fade modal-responsive MyProfileModal',
                    controller: 'Profile'
                });
            }
            else{
                    $state.go('profileMobile');
            }
        }
        else{
            $modal.open({
                templateUrl: 'partials/medic/profile.html',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'fade modal-responsive MyProfileModal',
                controller: 'Profile'
            });
        }
    };
    //$scope.animateInput=function(){
    //    angular.element('.form-control').removeClass('popSearch');
    //};
    $scope.textToSearch="";
    $scope.getInput = function(){
        var x = document.getElementById("upperSearch");
        $scope.textToSearch = x.value;
    };
    $scope.navCollapsed = true;
    $scope.closeNavbar = function () {
        $scope.navCollapsed = true;
    };
    $scope.openNavbar = function () {
        $scope.navCollapsed = false;
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.closeNavbar();
    });
    $scope.searchText=function(data){
        if(data==="")
            return;
        else{
            $state.go('homeSearch',{textToSearch: data},{reload: true});
            $scope.closeNavbar();
        }
    };
    $scope.showInput=false;
    $scope.animateInput=function(){
        angular.element('.popSearch').toggleClass('newWidthPopSearch');
        angular.element('.input-group-addon').toggleClass('btnSearchBefore');
    };
    angular.element(document).click(function (event) {
        var clickover = angular.element(event.target);
        var $navbar = angular.element(".navbar-collapse");
        var _opened = $navbar.hasClass("in");
        if (_opened === true && !clickover.hasClass("navbar-toggle")&& !clickover.hasClass("mySearchInDropdown")) {
            angular.element("button.navbar-toggle").click();
        }
    });

}]);