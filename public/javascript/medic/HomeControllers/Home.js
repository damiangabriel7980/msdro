app.controllerProvider.register('Home', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate','$document','$window','$timeout','$state','$anchorScroll', 'Utils', 'Success', 'SpecialFeaturesService', 'brochureService', function($scope, $rootScope, HomeService, $sce, $modal,$animate,$document,$window,$timeout,$state,$anchorScroll, Utils,Success,SpecialFeaturesService, brochureService) {

    $scope.monthsArray = Utils.getMonthsArray();
    $scope.merckBoxUrl = $sce.trustAsResourceUrl('partials/medic/widgets/merckBox.html');
    $scope.PharmaUrl = $sce.trustAsResourceUrl('partials/medic/widgets/PharmaCourse.html');
    $scope.glycemizerURL = $sce.trustAsResourceUrl('partials/medic/widgets/Glycemizer.html');
    $scope.immunologyURL = $sce.trustAsResourceUrl('partials/medic/widgets/Immunology.html');
    $scope.univadisURL = $sce.trustAsResourceUrl('partials/medic/widgets/Univadis.html');
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

    SpecialFeaturesService.specialGroups.getSelected().then(function (specialGroupSelected) {

        //populate widgets
        if(specialGroupSelected){
            //check if widget exists for selected group
            if(specialGroupWidgets[specialGroupSelected.display_name]){
                $scope.specialWidgetUrl = $sce.trustAsResourceUrl('partials/medic/widgets/'+specialGroupWidgets[specialGroupSelected.display_name]);
            }
        }

        //get content
        getAllContent(specialGroupSelected);

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

    $scope.navigateToMultimedia = function (multimedia) {
        if(Utils.isMobile){
            $state.go("elearning.multimedia.multimediaByArea", {idArea:0, idMulti: multimedia._id});
        }else{
            $state.go("elearning.multimedia.multimediaMobile", {id: multimedia._id});
        }
    };

    //------------------------------------------------------------------------------------------------- get all content
    var getAllContent = function (specialGroupSelected) {

        HomeService.events.query({specialGroupSelected: specialGroupSelected?specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
            $scope.events = Success.getObject(resp);
        });
        HomeService.news.query({scientific:true,specialGroupSelected: specialGroupSelected?specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
            $scope.scientificNews = Success.getObject(resp);
        });
        HomeService.multimedia.query({specialGroupSelected: specialGroupSelected?specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
            $scope.multimedia = Success.getObject(resp);
        });

        brochureService.sections.query({firstOnly: true}).$promise.then(function (resp) {
            $scope.brochure = Success.getObject(resp)[0];
        });

        HomeService.carousel.query({specialGroupSelected: specialGroupSelected?specialGroupSelected._id.toString():null}).$promise.then(function(resp){
            $scope.HomeCarousel = Success.getObject(resp);
            if($scope.HomeCarousel[0]){
                $scope.firstIllusion=Success.getObject(resp)[$scope.HomeCarousel.length-1];
                $scope.lastIllusion=Success.getObject(resp)[0];
            }
        });
    };
    //------------------------------------------------------------------------------------------------ useful functions

    $scope.toDate = function (ISOdate) {
        return new Date(ISOdate);
    };
    
    /* --- footer realign ---*/

    $scope.iconLive='<i class="glyphicon glyphicon-facetime-video" ng-if="e.type==2"></i>&nbsp;';

}]);