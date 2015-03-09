controllers.controller('DownloadsView', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.downloads = resp.success;
    });
    ContentService.mostRead.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.mostDownloads = resp.success;
    });

}]);