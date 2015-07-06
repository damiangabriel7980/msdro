controllers.controller('HomeDownloads', ['$scope', '$rootScope', 'ContentService', '$sce', 'Error', 'Success', function($scope, $rootScope, ContentService, $sce, Error, Success) {

    ContentService.content.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.downloads = Success.getObject(resp);

        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = $scope.downloads.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 8;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.downloadsFiltered = $scope.downloads.slice(beginSlice, endSlice);
        });
    });

}]);