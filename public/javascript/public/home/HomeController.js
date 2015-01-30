publicControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$state', function($scope, $rootScope, HomeService, $sce, $state) {

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
        var tooltipContent = '<img src="'+src+'">'+$scope.createHeader(slide.title, 40);
        return $sce.trustAsHtml(tooltipContent);
    };

    $scope.carouselLearnMore = function (type, id) {
        switch(type){
            case 1: $state.go('stiri.detail', {id: id}); break;
            case 2: $state.go('articole.detail', {id: id}); break;
            case 3: $state.go('elearning.detail', {id: id}); break;
            case 4: $state.go('downloads.detail', {id: id}); break;
            default: break;
        }
    };

    //------------------------------------------------------------------------------------------------ useful functions

    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        var textLength = text?text.length:0;
        if(textLength > length){
            return $scope.htmlToPlainText(text).substring(0,length)+"...";
        }else{
            return $scope.htmlToPlainText(text);
        }
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    }

}]).filter('repeatReverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});