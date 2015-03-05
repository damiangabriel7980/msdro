controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope','alterIntroService', function ($scope, $state, $modal,$rootScope,alterIntroService) {
    $rootScope.$watch('specialGroupSelected',function(oldVal,newVal){
        if(!localStorage.statusModalGroups)
        {
            var modalGroups={};
            for(var i=0;i<$rootScope.specialGroups.length;i++)
            {
                modalGroups[$rootScope.specialGroups[i]._id]=true;
                console.log(modalGroups);
            }
            //if(sessionStorage.statusModalGroups)
            //    sessionStorage.removeItem('statusModalGroups');
            localStorage.setItem('statusModalGroups',JSON.stringify(modalGroups));
            $modal.open({
                templateUrl: 'partials/medic/modals/presentationModal.html',
                size: 'lg',
                keyboard: false,
                backdrop: 'static',
                windowClass: 'fade',
                controller: 'PresentationModal'
            });
        }
        else
        {
//            if($rootScope.specialGroupSelected==undefined)
//                return;
            alterIntroService.alterIntro.query().$promise.then(function(resp){
                $scope.introSession=resp;
                if($scope.introSession[$rootScope.specialGroupSelected._id]===true)
                {
                    if(JSON.parse(localStorage.getItem('statusModalGroups'))[$rootScope.specialGroupSelected._id]===true && $state.includes('home'))
                    {
                        $modal.open({
                            templateUrl: 'partials/medic/modals/presentationModal.html',
                            size: 'lg',
                            keyboard: false,
                            backdrop: 'static',
                            windowClass: 'fade',
                            controller: 'PresentationModal'
                        }).opened.then(function(selectedModal){

                            });
                    }

//                    alterIntroService.alterIntro.save({groupID: $rootScope.specialGroupSelected._id}).$promise.then(function(alteredSession){
//                        console.log(alteredSession);
//                        if(JSON.parse(localStorage.getItem('statusModalGroups'))[$rootScope.specialGroupSelected._id]===true && $state.includes('home'))
//                        {
//                            if (opened)
//                                return;
//                            opened = true;
//                            $modal.open({
//                                templateUrl: 'partials/medic/modals/presentationModal.html',
//                                size: 'lg',
//                                keyboard: false,
//                                backdrop: 'static',
//                                windowClass: 'fade',
//                                controller: 'PresentationModal'
//                            }).opened.then(function(selectedModal){
//
//                                });
//                        }
//                    })
                }
            });
        }
    });

    $scope.showFarmaModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'partials/medic/modals/Farma.html',
            keyboard: false,
            controller: 'Pharmacovigilance',
            size: 'lg',
            windowClass: 'fade',
            backdrop: 'static'
            //windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
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
        $modal.open({
            templateUrl: 'partials/medic/modals/Terms.html',
            size: 'lg',
            windowClass: 'fade',
            backdrop: 'static',
            controller: 'Terms',
            keyboard: false
            //windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
    };

    //merck modal
    $scope.showMerckManual = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/merckManual.html',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            windowClass: 'fade',
            controller: 'MerckManual'
        });
    };

    //profile modal
    $scope.showProfile = function(){
        $modal.open({
            templateUrl: 'partials/medic/profile.html',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            windowClass: 'fade',
            controller: 'Profile'
        });
    };

    $scope.animateInput=function(){
        angular.element('.form-control').removeClass('popSearch');
    };

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
        if (_opened === true && !clickover.hasClass("navbar-toggle")) {
            //$navbar.collapse('hide');
            //$navbar.height(0);
            angular.element("button.navbar-toggle").click();
        }
    });

}]);