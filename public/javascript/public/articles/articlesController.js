publicControllers.controller('ArticlesController', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.articlesLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.contentByType.query({type: 2}).$promise.then(function (resp) {
        $scope.news = resp;
    });
    ContentService.mostReadByType.query({type: 2}).$promise.then(function (resp) {
        $scope.mostRead = resp;
    });

}]);