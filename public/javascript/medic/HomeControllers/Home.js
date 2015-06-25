controllers.controller('Home', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate','$document','$window','$timeout','$state','$anchorScroll', 'Utils', function($scope, $rootScope, HomeService, $sce, $modal,$animate,$document,$window,$timeout,$state,$anchorScroll, Utils) {

    $scope.monthsArray = Utils.getMonthsArray();
    $scope.merckBoxUrl = $sce.trustAsResourceUrl('partials/medic/widgets/merckBox.html');
    $scope.myInterval = 10;
    $scope.HomeCarousel = [];
    $scope.selectedIndexCarousel = 0;
    $scope.setSlideCarousel = function(index)
    {
        $scope.selectedIndexCarousel = index;
    };
    //add widgets in partials/medic/widgets, then associate file name and group name in object below
    var specialGroupWidgets = {
        "MSD Diabetes": "Glycemizer.html",
        "Diabetes and Nutrition": "Glycemizer.html",
        "Immunology - Rheumatology":"Immunology.html"
    };

    $scope.$watch($rootScope.specialGroupSelected, function () {
        //check if special group is selected
        if($rootScope.specialGroupSelected){
            //check if widget exists for selected group
            if(specialGroupWidgets[$rootScope.specialGroupSelected.display_name]){
                $scope.specialWidgetUrl = $sce.trustAsResourceUrl('partials/medic/widgets/'+specialGroupWidgets[$rootScope.specialGroupSelected.display_name]);
            }
        }
    });

    $scope.carouselNavigate = function (carouselItem) {
        if(carouselItem.redirect_to_href){
            window.location.href = carouselItem.redirect_to_href;
        }else{
            $state.go("noutati.articol", {articleId: carouselItem.article_id._id, articleType: carouselItem.article_id.type});
        }
    };

    $scope.navigateToNews = function (article) {
        $state.go('noutati.articol', {articleType: article.type, articleId: article._id, fromHome: 1});
    };

    $scope.navigateToArticles = function (article) {
        $state.go('noutati.articol', {articleType: article.type, articleId: article._id, fromHome: 1});
    };

       //------------------------------------------------------------------------------------------------- get all content

    HomeService.events.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.events = resp.success;
    });
    HomeService.news.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.news = resp.success;
    });
    HomeService.news.query({scientific:true,specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.scientificNews = resp.success;
    });
    HomeService.multimedia.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.multimedia = resp.success;
    });

    HomeService.carousel.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
        $scope.HomeCarousel=resp.success;
        if($scope.HomeCarousel[0]){
            $scope.firstIllusion=resp.success[$scope.HomeCarousel.length-1];
            $scope.lastIllusion=resp.success[0];
        }
    });
    //------------------------------------------------------------------------------------------------ useful functions

    $scope.toDate = function (ISOdate) {
        return new Date(ISOdate);
    };

    /* --- footer realign ---*/

    $scope.iconLive='<i class="glyphicon glyphicon-facetime-video smallFontSize" ng-if="e.type==2"></i>&nbsp;';

}]);