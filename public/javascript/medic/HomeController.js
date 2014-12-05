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

    $scope.basicUsageOptions = {
        $AutoPlay: true
    };

    $scope.sliderWithArrowOptions = {
        $DragOrientation: 3,                            //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
        $SlideDuration: 800,                            //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500

        $ArrowNavigatorOptions: {                       //[Optional] Options to specify and enable arrow navigator or not
            $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
            $ChanceToShow: 2,                           //[Required] 0 Never, 1 Mouse Over, 2 Always
            $AutoCenter: 2,                             //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
            $Steps: 1                                   //[Optional] Steps to go for each navigation request, default value is 1
        }
    }


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
    .directive('setNgAnimate', ['$animate', function ($animate) {
        return {
            link: function ($scope, $element, $attrs) {
                $scope.$watch( function() {
                    return $scope.$eval($attrs.setNgAnimate, $scope);
                }, function(valnew, valold){
                    console.log('Directive animation Enabled: ' + valnew);
                    $animate.enabled(!!valnew, $element);
                });
            }
        };
    }]);

