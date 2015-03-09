controllers.controller('NewsView', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.articlesLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({type: 1}).$promise.then(function (resp) {
        $scope.news = resp.success;
    });
    ContentService.mostRead.query({type: 1}).$promise.then(function (resp) {
        $scope.mostRead = resp.success;
    });

}]);