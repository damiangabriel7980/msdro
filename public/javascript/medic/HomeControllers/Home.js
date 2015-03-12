controllers.controller('Home', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal','$animate','$document','$window','$timeout','$state','$anchorScroll', function($scope, $rootScope, HomeService, $sce, $modal,$animate,$document,$window,$timeout,$state,$anchorScroll) {

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.monthsArray = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
    $scope.merckBoxUrl = $sce.trustAsResourceUrl('partials/medic/widgets/merckBox.html');
    $scope.merckManualImage = $rootScope.merckManualImage;
    $scope.myInterval = 10;
    $scope.HomeCarousel = [];
    $scope.selectedIndexCarousel = 0;
    $scope.setSlideCarousel = function(index)
    {
        $scope.selectedIndexCarousel = index;
    };
    //add widgets in partials/medic/widgets, then associate file name and group name in object below
    var specialGroupWidgets = {
        "MSD Diabetes": "Glycemizer.html"
    };
    $scope.specialWidgetUrl = null;

    $scope.$watch($rootScope.specialGroupSelected, function () {
        //check if special group is selected
        if($rootScope.specialGroupSelected){
            //check if widget exists for selected group
            if(specialGroupWidgets[$rootScope.specialGroupSelected.display_name]){
                $scope.specialWidgetUrl = $sce.trustAsResourceUrl('partials/medic/widgets/'+specialGroupWidgets[$rootScope.specialGroupSelected.display_name]);
            }
        }
    });
    HomeService.getUserImage.query().$promise.then(function(resp){
        $rootScope.imageForUser = resp.image_path;
        $rootScope.userFullName=resp.name;
    });

       //------------------------------------------------------------------------------------------------- get all content

    HomeService.getUserEvents.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.events = resp;
    });
    HomeService.getUserNews.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.news = resp;
    });
    HomeService.getUserScientificNews.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.scientificNews = resp;
    });
    HomeService.getUserMultimedia.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        $scope.multimedia = resp;
    });

    HomeService.getCarousel.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(resp){
        $scope.HomeCarousel=resp;
        if($scope.HomeCarousel[0]){
            $scope.firstIllusion=resp[$scope.HomeCarousel.length-1];
            $scope.lastIllusion=resp[0];
        }
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtmlTrimmed=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        var newText = convertedText.split(/\s+/).slice(0,3).join(" ");
        newText += '...';
        return $sce.trustAsHtml(newText);
    };
    $scope.convertAndTrustAsHtml=function (data,limit) {
        if(limit!=0)
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').substring(0,limit) + '...';
        else
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    //------------------------------------------------------------------------------------------------ useful functions
    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş').replace(/&Acirc;/g,'Â').replace(/&Icirc;/g,'Î');
    };

    $scope.createHeader = function (text,length) {
        return $scope.htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.toDate = function (ISOdate) {
        return new Date(ISOdate);
    };
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };

    $scope.deviceWidth = screen.availWidth;
    /* --- carousel --- */



    /* --- footer realign ---*/

    $scope.iconLive='<i class="glyphicon glyphicon-facetime-video smallFontSize" ng-if="e.type==2"></i>&nbsp;';

}])
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

