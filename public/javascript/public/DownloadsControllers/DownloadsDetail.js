controllers.controller('DownloadsDetail', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', 'Error', 'Success',function($scope, $rootScope, ContentService, $sce, $stateParams, Error, Success) {
    ContentService.content.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.currentDownload = Success.getObject(resp);
    });

}]);