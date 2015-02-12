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
        var tooltipContent = '<img src="'+src+'">'+$rootScope.createHeader(slide.title, 40);
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

    //if user accesses the home page from an e-mail activation link,
    //show a custom modal
    var showActivationModal = sessionStorage.requestedStaywellActivation;
    var activationSuccess = sessionStorage.activatedStaywellAccount;
    delete sessionStorage.requestedStaywellActivation;
    delete sessionStorage.activatedStaywellAccount;
    if(showActivationModal == 1){
        if(activationSuccess == 1){
            $rootScope.showAuthModal("activationSuccess");
        }else{
            $rootScope.showAuthModal("activationFailed");
        }
    }

}]).filter('repeatReverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});