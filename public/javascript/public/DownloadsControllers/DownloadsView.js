controllers.controller('DownloadsView', ['$scope', '$state', '$rootScope', 'ContentService', '$sce', function($scope, $state, $rootScope, ContentService, $sce) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.downloads = resp.success;
    });
    ContentService.mostRead.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.mostDownloads = resp.success;
    });

    $scope.navigateToDownloads = function (content) {
        $state.go('downloads.detail', {id: content._id});
    }

}]);