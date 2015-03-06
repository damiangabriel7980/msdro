controllers.controller('HomeNews', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    ContentService.content.query({type: 1}).$promise.then(function (resp) {
        $scope.noutati = resp.success;

        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = resp.success.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 5;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.noutatiFiltered = $scope.noutati.slice(beginSlice, endSlice);
        });
    });

}]);