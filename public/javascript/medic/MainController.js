controllers.controller('MainController', ['$scope', '$state', '$modal', function ($scope, $state, $modal) {

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
            templateUrl: 'partials/medic/contact.ejs',
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