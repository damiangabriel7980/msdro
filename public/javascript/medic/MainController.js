controllers.controller('MainController', ['$scope', '$state', '$modal','$rootScope','alterIntroService', function ($scope, $state, $modal,$rootScope,alterIntroService) {
    var changeLocalGroupModalStatus= function(groupID,value){
        var retrievedObject = localStorage.getItem('statusModalGroups');
        var statusModals = JSON.parse(retrievedObject);
        statusModals[groupID] = value;
        localStorage.setItem('statusModalGroups',JSON.stringify(statusModals));
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
                            console.log(modalGroups);
                        }
                        localStorage.setItem('statusModalGroups',JSON.stringify(modalGroups));
                        alterIntroService.checkIntroEnabled.query({specialGroupSelected:null}).$promise.then(function(resp){
                            if(resp._id)
                            {
                                $modal.open({
                                    templateUrl: 'partials/medic/modals/presentationModal.html',
                                    size: 'lg',
                                    keyboard: false,
                                    backdrop: 'static',
                                    windowClass: 'fade',
                                    controller: 'PresentationModal'
                                });
                            }
                        });

                    });

                }
                else
                {
                    for(var i=0;i<$rootScope.specialGroups.length;i++)
                    {
                        modalGroups[$rootScope.specialGroups[i]._id]=true;
                        console.log(modalGroups);
                    }
                    localStorage.setItem('statusModalGroups',JSON.stringify(modalGroups));
                    alterIntroService.checkIntroEnabled.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
                        if(resp._id)
                        {
                            $modal.open({
                                templateUrl: 'partials/medic/modals/presentationModal.html',
                                size: 'lg',
                                keyboard: false,
                                backdrop: 'static',
                                windowClass: 'fade',
                                controller: 'PresentationModal'
                            });
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
                        console.log( $scope.introSession);
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
                                        $modal.open({
                                            templateUrl: 'partials/medic/modals/presentationModal.html',
                                            size: 'lg',
                                            keyboard: false,
                                            backdrop: 'static',
                                            windowClass: 'fade',
                                            controller: 'PresentationModal'
                                        });
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
                                        $modal.open({
                                            templateUrl: 'partials/medic/modals/presentationModal.html',
                                            size: 'lg',
                                            keyboard: false,
                                            backdrop: 'static',
                                            windowClass: 'fade',
                                            controller: 'PresentationModal'
                                        });
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
        var modalInstance = $modal.open({
            templateUrl: 'partials/medic/modals/Farma.html',
            keyboard: false,
            controller: 'Pharmacovigilance',
            size: 'lg',
            windowClass: 'fade modal-responsive',
            backdrop: 'static'
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
            windowClass: 'fade modal-responsive',
            backdrop: 'static',
            controller: 'Terms',
            keyboard: false
        });
    };

    //merck modal
    $scope.showMerckManual = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/merckManual.html',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            windowClass: 'fade modal-responsive',
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
            windowClass: 'fade modal-responsive',
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