publicControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate', function($scope, $rootScope, HomeService, $sce, $modal,$animate) {

    $scope.monthsArray = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
    $scope.carouselSlides = [];
    $scope.selectedIndex = 0;
    $scope.setSlide = function(index) {
        $scope.selectedIndex = index;
    };


    //------------------------------------------------------------------------------------------------- get all content

    HomeService.getCarouselData.query().$promise.then(function(resp){
        $scope.carouselSlides = resp;
        $scope.selectedIndex = 1;
    });

    HomeService.events.query().$promise.then(function (resp) {
        $scope.events = resp;
    });

    $scope.getTooltip = function (slide) {
        var src = $rootScope.pathAmazonDev + slide.image_path;
        var tooltipContent = '<img src="'+src+'">'+slide.title;
        return $sce.trustAsHtml(tooltipContent);
    };

    //------------------------------------------------------------------------------------------------ useful functions

    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return $scope.htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    }

}]).filter('repeatReverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});