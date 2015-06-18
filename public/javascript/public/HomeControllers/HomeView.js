controllers.controller('HomeView', ['$scope', '$rootScope', 'HomeService', '$sce', '$state', 'StateService', 'Utils', function($scope, $rootScope, HomeService, $sce, $state, StateService, Utils) {

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

    HomeService.getCarouselData.query().$promise.then(function(resp){
        $scope.carouselSlides = resp;
    });

    HomeService.events.query().$promise.then(function (resp) {
        $scope.events = resp;
    });

    $scope.carouselLearnMore = function (slide) {
        var type = slide.type;
        var id = slide.content_id;
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