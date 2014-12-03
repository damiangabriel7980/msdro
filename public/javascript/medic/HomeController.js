cloudAdminControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal', function($scope, $rootScope, HomeService, $sce, $modal) {

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.monthsArray = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
    $scope.merckBoxUrl = $sce.trustAsResourceUrl('partials/medic/widgets/merckBox.html');
    $scope.merckManualImage = $rootScope.merckManualImage;
    $scope.myInterval = 60000;

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

    HomeService.getCarousel.query().$promise.then(function(resp){
        $scope.HomeCarousel=resp;

    });




    //$scope.$watch('HomeCarousel', function(values) {
    //    var i, a = [], b;
    //
    //    for (i = 0; i <  $scope.HomeCarousel.length; i += 3) {
    //        b = { image1:  $scope.HomeCarousel[i] };
    //
    //        if ($scope.HomeCarousel[i + 2]) {
    //            b.image2=$scope.HomeCarousel[i + 1];
    //            b.image3=$scope.HomeCarousel[i + 2];
    //        }
    //
    //        a.push(b);
    //    }
    //
    //    $scope.groupedSlides = a;
    //}, true);


    //------------------------------------------------------------------------------------------------ useful functions
    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.toDate = function (ISOdate) {
        return new Date(ISOdate);
    };



    //merck modal
    $rootScope.showMerckManual = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/merckManual.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'MerckManualController',
            windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
    };
    $rootScope.showFarmaModal = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/Farma.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'FarmacovigilentaCtrl',
            windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
    };
    $rootScope.showTermsModal = function(){
        $modal.open({
            templateUrl: 'partials/medic/modals/Terms.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'TermsCtrl',
            windowTemplateUrl: 'partials/medic/modals/responsiveModalTemplate.html'
        });
    };


}])
    .directive('disableNgAnimate', ['$animate', function($animate) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $animate.enabled(false, element);
            }
        };
    }]);

