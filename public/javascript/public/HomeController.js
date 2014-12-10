publicControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate', function($scope, $rootScope, HomeService, $sce, $modal,$animate) {

    $scope.monthsArray = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
    $scope.carouselSlides = [];


    //------------------------------------------------------------------------------------------------- get all content

    HomeService.getCarouselData.query().$promise.then(function(resp){
        console.log(resp);
        $scope.carouselSlides = resp;
        $scope.selectedIndex = 1;
    });

    //============================================================================================= responsive carousel

    $scope.getWindowDimensions = function () {
        return {
            'h': window.innerHeight,
            'w': window.innerWidth
        };
    };
    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        $scope.windowHeight = newValue.h;
        $scope.windowWidth = newValue.w;

        var carouselH = newValue.w / 3;

        $scope.carouselStyle = 'height:' + carouselH + 'px;' +
            'width:' + (newValue.w) + 'px;';

        var offset_Y = newValue.h / 20;

        $scope.fixedBoxStyle = 'top:' + offset_Y + 'px;' +
            'height:' + (carouselH - (2 * offset_Y)) + 'px;' +
            'width:' + (newValue.w / 2) + 'px;';

        $scope.cNavStyle = 'bottom:' + offset_Y + 'px;' +
            'width:' + (newValue.w / 2 - 40) + 'px;';
    });

    $scope.selectedIndex = 1;
    $scope.setSlide = function(index) {
        $scope.selectedIndex = index;
    };

    //------------------------------------------------------------------------------------------------ useful functions

    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
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
}]);