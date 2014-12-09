cloudAdminControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate', function($scope, $rootScope, HomeService, $sce, $modal,$animate) {

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

    setTimeout(function(){$("#footer").css({'margin-top': 0});
    var margin = Math.floor($(window).outerHeight() - $(".homeStyles").outerHeight() - $('#footer').outerHeight() - 80);
    $("#footer").css({'margin-top': (margin > 20 ? margin : 20)});},1000);

    /* --- carousel --- */

    $scope.imgArray = [
        {
            imgSrc : "stylesheets/img/img1.jpg",
            text : "Text 1"
        },
        {
            imgSrc : "stylesheets/img/img2.jpg",
            text : "Text 2"
        },
        {
            imgSrc : "stylesheets/img/img3.jpg",
            text : "Text 3"
        },
        {
            imgSrc : "stylesheets/img/img4.jpg",
            text : "Text 4"
        },
        {
            imgSrc : "stylesheets/img/img5.jpg",
            text : "Text 5"
        }
    ]

    $scope.selectedIndex = 1;

    $scope.setSlide = function(index)
    {
        $scope.selectedIndex = index;
    }

    $(document).on('ajaxComplete', function () {
        $("#footer").css({'margin-top': 0});
        var margin = Math.floor($(window).outerHeight() - $(".homeStyles").outerHeight() - $('#footer').outerHeight() - 80);
        $("#footer").css({'margin-top': (margin > 20 ? margin : 20)});
    });
    $(window).on('resize', function () {
        $("#footer").css({'margin-top': 0});
        var margin = Math.floor($(window).outerHeight() - $(".homeStyles").outerHeight() - $('#footer').outerHeight() - 80);
        $("#footer").css({'margin-top': (margin > 20 ? margin : 20)});
    });
}]);
