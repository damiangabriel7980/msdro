publicControllers.controller('NewsController', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.articlesLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.contentByType.query({type: 1}).$promise.then(function (resp) {
        $scope.news = resp;
    });
    ContentService.mostReadByType.query({type: 1}).$promise.then(function (resp) {
        $scope.mostRead = resp;
    });

}]);