controllers.controller('ArticlesView', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.articlesLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({type: 2}).$promise.then(function (resp) {
        $scope.news = resp.success;
    });
    ContentService.mostReadByType.query({type: 2}).$promise.then(function (resp) {
        $scope.mostRead = resp;
    });

}]);