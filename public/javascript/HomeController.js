cloudAdminControllers.controller('HomeController', ['$scope', '$rootScope', 'HomeService', '$sce',function($scope, $rootScope, HomeService, $sce) {

    $scope.imagePre = $rootScope.pathAmazonDev;

    //------------------------------------------------------------------------------------------------- get all content
    HomeService.getUserEvents.query().$promise.then(function (resp) {
        $scope.events = resp;
        console.log(resp);
    });
    HomeService.getUserNews.query().$promise.then(function (resp) {
        $scope.news = resp;
        console.log(resp);
    });
    HomeService.getUserScientificNews.query().$promise.then(function (resp) {
        $scope.scientificNews = resp;
        console.log(resp);
    });

    //------------------------------------------------------------------------------------------------ useful functions
    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
    };

}]);