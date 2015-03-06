controllers.controller('DownloadsView', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({type: 4}).$promise.then(function (resp) {
        $scope.downloads = resp.success;
    });
    ContentService.mostReadByType.query({type: 4}).$promise.then(function (resp) {
        $scope.mostDownloads = resp;
    });

}]);