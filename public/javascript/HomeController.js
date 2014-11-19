cloudAdminControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce', '$modal', function($scope, $rootScope, HomeService, $sce, $modal) {

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.monthsArray = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
    $scope.merckBoxUrl = $sce.trustAsResourceUrl('partials/widgets/merckBox.html');
    $scope.merckManualImage = $rootScope.merckManualImage;

    //------------------------------------------------------------------------------------------------- get all content
    HomeService.getUserEvents.query().$promise.then(function (resp) {
        $scope.events = resp;
    });
    HomeService.getUserNews.query().$promise.then(function (resp) {
        $scope.news = resp;
    });
    HomeService.getUserScientificNews.query().$promise.then(function (resp) {
        $scope.scientificNews = resp;
    });
    HomeService.getUserMultimedia.query().$promise.then(function (resp) {
        $scope.multimedia = resp;
    });

    //------------------------------------------------------------------------------------------------ useful functions
    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
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
            templateUrl: 'partials/modals/merckManual.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'MerckManualController',
            windowTemplateUrl: 'partials/modals/responsiveModalTemplate.html'
        });
    };

}]);