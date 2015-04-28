controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope','alterIntroService','$window','$cookies', function ($scope, $state, $modal,$rootScope,alterIntroService,$window,$cookies) {

    var openIntro = function () {
        $modal.open({
            templateUrl: 'partials/medic/modals/presentationModal.html',
            keyboard: false,
            backdrop: 'static',
            windowClass: 'fade',
            controller: 'PresentationModal'
        });
    };

    var changeLocalGroupModalStatus= function(groupID,value){
        var retrievedObject = localStorage.getItem('statusModalGroups');
        var statusModals = JSON.parse(retrievedObject);
        statusModals[groupID] = value;
        localStorage.setItem('statusModalGroups',JSON.stringify(statusModals));
    };
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
    function setCookie(cname, cvalue) {
        var now = new Date(),
        // this will set the expiration to 6 months
            exp = new Date(now.getFullYear(), now.getMonth()+6, now.getDate());
        var expires = "expires="+exp.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    }

        var MSDCookie=getCookie("MSDCookies");
        if (MSDCookie!="") {
            if(MSDCookie=='yes')
                $scope.isCollapsed=true;
            else
                $scope.isCollapsed=false;
        }else{
            $scope.isCollapsed=false;
        }
    $scope.setCookie=function(){
        setCookie('MSDCookies','yes');
        $scope.isCollapsed=true;
    };

    $rootScope.$watch('specialGroupSelected',function(oldVal,newVal){
        if($rootScope.specialGroupSelected!=undefined || $rootScope.specialGroupSelected===null)
        {
            if(!localStorage.statusModalGroups)
            {
                var modalGroups={};
                if($rootScope.specialGroups===undefined)
                {
                    alterIntroService.getDefaultGroupID.query().$promise.then(function(group){
                        var defaultGroupArray=[];
                        defaultGroupArray.push(group.defaultGroup);
                        for(var i=0;i<defaultGroupArray.length;i++)
                        {
                            modalGroups[defaultGroupArray[i]]=true;
                        }
                        localStorage.setItem('statusModalGroups',JSON.stringify(modalGroups));
                        alterIntroService.checkIntroEnabled.query({specialGroupSelected:null}).$promise.then(function(resp){
                            if(resp._id)
                            {
                                openIntro();
                            }
                        });

                    });

                }
                else
                {
                    for(var i=0;i<$rootScope.specialGroups.length;i++)
                    {
                        modalGroups[$rootScope.specialGroups[i]._id]=true;
                    }
                    localStorage.setItem('statusModalGroups',JSON.stringify(modalGroups));
                    alterIntroService.checkIntroEnabled.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
                        if(resp._id)
                        {
                            openIntro();
                        }
                    });
                }

            }
            else
            {
               if($rootScope.specialGroupSelected===null)
                {
                    alterIntroService.alterIntro.query().$promise.then(function(resp){

                        $scope.introSession=resp;
                      alterIntroService.getDefaultGroupID.query().$promise.then(function(group){
                            if($scope.introSession[group.defaultGroup]===true)
                        {
                            if(JSON.parse(localStorage.getItem('statusModalGroups'))[group.defaultGroup]==undefined)
                                changeLocalGroupModalStatus(group.defaultGroup,true);
                            if(JSON.parse(localStorage.getItem('statusModalGroups'))[group.defaultGroup]===true && $state.includes('home'))
                            {
                                alterIntroService.checkIntroEnabled.query({specialGroupSelected:null}).$promise.then(function(resp){
                                    if(resp._id)
                                    {
                                        openIntro();
                                    }
                                });
                            }
                        }
                        });
                    });
                }
                else{
                    alterIntroService.alterIntro.query().$promise.then(function(resp){

                        $scope.introSession=resp;
                        if($scope.introSession[$rootScope.specialGroupSelected._id]===true)
                        {
                            if(JSON.parse(localStorage.getItem('statusModalGroups'))[$rootScope.specialGroupSelected._id]==undefined)
                                changeLocalGroupModalStatus($rootScope.specialGroupSelected._id,true);
                            if(JSON.parse(localStorage.getItem('statusModalGroups'))[$rootScope.specialGroupSelected._id]===true && $state.includes('home'))
                            {
                                alterIntroService.checkIntroEnabled.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
                                    if(resp._id)
                                    {
                                        openIntro();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }

    });

    $scope.showFarmaModal = function() {
        if($rootScope.iosDetect)
            window.open($rootScope.Pharma);
        else {
            var modalInstance = $modal.open({
                templateUrl: 'partials/medic/modals/Farma.html',
                keyboard: false,
                controller: 'Pharmacovigilance',
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
            windowClass: 'fade',
            controller: 'Contact'
        });
    };

    $scope.showTermsModal = function(){
        if($rootScope.iosDetect)
            window.open($rootScope.Terms);
        else {
            $modal.open({
                templateUrl: 'partials/medic/modals/Terms.html',
                size: 'lg',
                windowClass: 'fade modal-responsive',
                backdrop: 'static',
                controller: 'Terms',
                keyboard: false
            });
        }
    };

    //merck modal
    $scope.showMerckManual = function(){
        if($rootScope.iosDetect)
            window.open($rootScope.MerckManual);
        else{
            $modal.open({
                templateUrl: 'partials/medic/modals/merckManual.html',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                windowClass: 'fade modal-responsive',
                controller: 'MerckManual'
            });
        }
    };
    $scope.goToMerckManual=function(){
        window.open($rootScope.MerckManual,'_tab');
    };

    //profile modal
    $scope.showProfile = function(){
        $modal.open({
            templateUrl: 'partials/medic/profile.html',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'fade modal-responsive MyProfileModal',
            controller: 'Profile'
        });
    };
    //$scope.animateInput=function(){
    //    angular.element('.form-control').removeClass('popSearch');
    //};

    $scope.textToSearch="";
    $scope.getInput = function(){
        var x = document.getElementById("upperSearch");
        $scope.textToSearch = x.value;
    };

    $scope.searchText=function(data){
        if(data==="")
            return;
        else
            $state.go('homeSearch',{textToSearch: data},{reload: true});
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