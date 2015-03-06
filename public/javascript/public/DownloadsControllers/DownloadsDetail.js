controllers.controller('DownloadsDetail', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', function($scope, $rootScope, ContentService, $sce, $stateParams) {

    ContentService.content.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.currentDownload = resp.success;
    });

}]);