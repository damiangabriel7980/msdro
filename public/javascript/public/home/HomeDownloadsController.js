controllers.controller('HomeDownloadsController', ['$scope', '$rootScope', 'HomeService', '$sce', function($scope, $rootScope, HomeService, $sce) {

    HomeService.contentByType.query({type: 4}).$promise.then(function (resp) {
        $scope.downloads = resp;

        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = resp.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 8;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.downloadsFiltered = $scope.downloads.slice(beginSlice, endSlice);
        });
    });

}]);