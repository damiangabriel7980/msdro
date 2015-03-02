controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope', function ($scope, $state, $modal,$rootScope) {
    console.log(localStorage);
    var changeGroupModalStatus= function(groupID,value){
        var retrievedObject = sessionStorage.getItem('statusModalGroups');
        var statusModals = JSON.parse(retrievedObject);
        statusModals[groupID] = value;
        sessionStorage.setItem('statusModalGroups',JSON.stringify(statusModals));
    };
    $rootScope.$watch('specialGroups',function(){
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
            if(JSON.parse(localStorage.getItem('statusModalGroups'))[$rootScope.specialGroupSelected._id]===true)
            {
                if(JSON.parse(sessionStorage.getItem('statusModalGroups'))[$rootScope.specialGroupSelected._id]===true &&$state.includes('home'))
                {
                    changeGroupModalStatus($rootScope.specialGroupSelected._id,false);
                    $modal.open({
                        templateUrl: 'partials/medic/modals/presentationModal.html',
                        size: 'lg',
                        keyboard: false,
                        backdrop: 'static',
                        windowClass: 'fade',
                        controller: 'PresentationModal'
                    });
                }
            }
            else
            {
                console.log('No Presentation!');
            }
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