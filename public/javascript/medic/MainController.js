controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope','$window','$cookies','Utils', 'CookiesService', function ($scope, $state, $modal,$rootScope,$window,$cookies,Utils, CookiesService) {

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