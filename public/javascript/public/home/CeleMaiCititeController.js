publicControllers.controller('CeleMaiCititeController', ['$scope', '$rootScope', 'HomeService', '$sce', function($scope, $rootScope, HomeService, $sce) {

    HomeService.contentByType.query({type: 2}).$promise.then(function (resp) {
        $scope.articole = resp;

        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = resp.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 5;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.articoleFiltered = $scope.articole.slice(beginSlice, endSlice);
        });
    });

}]);