app.controllerProvider.register('HomeView', ['$scope', '$rootScope', 'HomeService', '$sce', '$state', 'StateService', 'Utils', 'Error', 'Success', function($scope, $rootScope, HomeService, $sce, $state, StateService, Utils, Error, Success) {

    if($rootScope.accessRoute){
        var state = StateService.getStateFromUrl($rootScope.accessRoute);
        if(state){
            $state.go(state.name, state.params);
        }else{
            //there is no state, or there are multiple states that match the url
        }
    }

    $scope.monthsArray = Utils.getMonthsArray();
    $scope.carouselSlides = [{
        title: "",
        description: "",
        type: "",
        content_id: "",
        image_path: ""
    }];

    //------------------------------------------------------------------------------------------------- get all content

    HomeService.CarouselData.query().$promise.then(function(resp){
        $scope.carouselSlides = Success.getObject(resp);
    });

    HomeService.events.query().$promise.then(function (resp) {
        $scope.events = Success.getObject(resp);
    });

    $scope.carouselLearnMore = function (slide) {
        switch(slide.link_name){
            case "content": navigateToContent(slide.links.content.type, slide.links.content._id); break;
            case "category": $state.go("articole.all", {category: slide.links.category._id}); break;
            case "url": window.location.href = slide.links.url
        }
    };

    var navigateToContent = function (type, id) {
        switch(type){
            case 1: $state.go('stiri.detail', {id: id}); break;
            case 2: $state.go('articole.detail', {id: id}); break;
            case 3: $state.go('elearning.detail', {area: 0, id: id}); break;
            case 4: $state.go('downloads.detail', {id: id}); break;
            default: break;
        }
    };

    if(REQUESTED_STAYWELL_LOGIN == 1){
        REQUESTED_STAYWELL_LOGIN = 0;
        $rootScope.showAuthModal("login");
    }else{
        //if user accesses the home page from an e-mail activation link,
        //show a custom modal
        if(REQUESTED_STAYWELL_ACTIVATION == 1){
            REQUESTED_STAYWELL_ACTIVATION = 0;
            if(ACTIVATED_STAYWELL_ACCOUNT == 1){
                ACTIVATED_STAYWELL_ACCOUNT = 0;
                $rootScope.showAuthModal("activationSuccess");
            }else{
                $rootScope.showAuthModal("activationFailed");
            }
        }
    }

}]);