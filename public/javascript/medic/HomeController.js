cloudAdminControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate','$document','$window', function($scope, $rootScope, HomeService, $sce, $modal,$animate,$document,$window) {

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.monthsArray = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
    $scope.merckBoxUrl = $sce.trustAsResourceUrl('partials/medic/widgets/merckBox.html');
    $scope.merckManualImage = $rootScope.merckManualImage;
    $scope.myInterval = 10;
    $scope.HomeCarousel = [];

    //------------------------------------------------------------ special groups widgets

    //add widgets in partials/medic/widgets, then associate file name and group name in object below
    var specialGroupWidgets = {
        "MSD Diabetes": "Glycemizer.html"
    };
    $scope.textToSearch="";
    $scope.specialWidgetUrl = null;

    $scope.$watch($rootScope.specialGroupSelected, function () {
        //check if special group is selected
        if($rootScope.specialGroupSelected){
            //check if widget exists for selected group
            if(specialGroupWidgets[$rootScope.specialGroupSelected.display_name]){
                $scope.specialWidgetUrl = $sce.trustAsResourceUrl('partials/medic/widgets/'+specialGroupWidgets[$rootScope.specialGroupSelected.display_name]);
            }
        }
    });
    HomeService.getUserImage.query().$promise.then(function(resp){
        $rootScope.imageForUser = resp.image_path;
        $rootScope.userFullName=resp.name;
    });

    //------------------------------------------------------------------------------------------------- get all content
    HomeService.getUserEvents.query().$promise.then(function (resp) {
        $scope.events = resp;
    });
    HomeService.getUserNews.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.news = resp;
    });
    HomeService.getUserScientificNews.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.scientificNews = resp;
    });
    HomeService.getUserMultimedia.query().$promise.then(function (resp) {
        $scope.multimedia = resp;
    });

    HomeService.getCarousel.query({specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
        $scope.HomeCarousel=resp;
        if($scope.HomeCarousel[0]){
            $scope.firstIllusion=resp[$scope.HomeCarousel.length-1];
            $scope.lastIllusion=resp[0];
        }
    });

    //------------------------------------------------------------------------------------------------ useful functions
    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return $scope.htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.toDate = function (ISOdate) {
        return new Date(ISOdate);
    };

    $scope.trimTitle=function(str) {
        return str.split(/\s+/).slice(0,3).join(" ");
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };


    //merck modal
    $rootScope.showMerckManual = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/merckManual.html',
            size: 'lg',
            backdrop: true,
            windowClass: 'fade',
            controller: 'MerckManualController',
            windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
    };
    $rootScope.textToSearch="";
    $rootScope.getInput = function(){
        var x = document.getElementById("upperSearch");
        $rootScope.textToSearch = x.value;
    };
    $rootScope.showFarmaModal = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/Farma.html',
            size: 'lg',
            windowClass: 'fade',
            backdrop: true,
            controller: 'FarmacovigilentaCtrl',
            windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
    };
    $rootScope.showContactModal = function(){
        $modal.open({
            templateUrl: 'partials/medic/contact.ejs',
            size: 'lg',
            backdrop: true,
            windowClass: 'fade',
            controller: 'contactCtrl'
        });
    };
    $rootScope.showTermsModal = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/Terms.html',
            size: 'lg',
            windowClass: 'fade',
            backdrop: true,
            controller: 'TermsCtrl',
            windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
    };
    /* --- carousel --- */

    $scope.selectedIndex = 0;

    /* --- footer realign ---*/

    $scope.setSlide = function(index)
    {
        $scope.selectedIndex = index;
    };

}])
    .directive('resizeFooter', function($document,$window,$timeout) {
        return {
            restrict: 'A',
            link:function ($scope, $element, attrs) {
                angular.element($window).load(function () {
                        angular.element("#footer").css({'margin-top': 0});
                        var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight());
                        angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 20)});
                });
                angular.element($window).bind('resize', function () {
                        angular.element("#footer").css({'margin-top': 0});
                        var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight());
                        angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 20)});
                });
                $document.bind('ajaxComplete', function () {
                        angular.element("#footer").css({'margin-top': 0});
                        var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight());
                        angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 20)});
                });
            }
        }
    });
