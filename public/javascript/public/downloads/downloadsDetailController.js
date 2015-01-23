publicControllers.controller('DownloadsDetailController', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', function($scope, $rootScope, ContentService, $sce, $stateParams) {

    ContentService.contentById.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.currentDownload = resp;
    });

    //------------------------------------------------------------------------------------------------ useful functions

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };

}]);