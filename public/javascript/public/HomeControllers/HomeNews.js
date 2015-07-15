app.controllerProvider.register('HomeNews', ['$scope', '$rootScope', 'ContentService', '$sce', 'Error', 'Success', function($scope, $rootScope, ContentService, $sce, Error, Success) {

    ContentService.content.query({type: 1}).$promise.then(function (resp) {
        $scope.noutati = Success.getObject(resp);

        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = $scope.noutati.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 5;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.noutatiFiltered = $scope.noutati.slice(beginSlice, endSlice);
        });
    });

}]);