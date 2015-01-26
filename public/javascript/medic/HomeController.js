cloudAdminControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate','$document','$window','$timeout','$state','$anchorScroll', function($scope, $rootScope, HomeService, $sce, $modal,$animate,$document,$window,$timeout,$state,$anchorScroll) {

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.monthsArray = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
    $scope.merckBoxUrl = $sce.trustAsResourceUrl('partials/medic/widgets/merckBox.html');
    $scope.merckManualImage = $rootScope.merckManualImage;
    $scope.myInterval = 10;
    $scope.HomeCarousel = [];

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
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş');
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
    $scope.searchText=function(){
        if($scope.textToSearch==="")
            return;
        else
            $state.go('homeSearch',{data:$scope.textToSearch});
    };
    /* --- carousel --- */

    $scope.selectedIndex = 0;

    /* --- footer realign ---*/

    $scope.setSlide = function(index)
    {
        $scope.selectedIndex = index;
    };
}])
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('thereIsMore', function($timeout,$document,$window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var footer = angular.element('#footer');
            var check = function () {
                if ($(document).height() <= ($(window).height() + $(window).scrollTop()))
                    footer.show();
                else
                    footer.hide();
                console.log(scope);
            };
            var appliedCheck = function () {
                scope.$apply(check);
            };
            angular.element($window).scroll(function () {
                appliedCheck();
            });
            check();
            $timeout(check, 250);
            angular.element($window).resize(function () {
                appliedCheck();
            });
        } // end of link
    }
});
