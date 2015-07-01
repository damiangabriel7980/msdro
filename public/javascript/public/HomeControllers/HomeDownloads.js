controllers.controller('HomeDownloads', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    ContentService.content.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.downloads = resp.success;

        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = resp.success.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 8;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.downloadsFiltered = $scope.downloads.slice(beginSlice, endSlice);
        });
    }).catch(function(err){
        console.log(err.data.error);
    });

}]);