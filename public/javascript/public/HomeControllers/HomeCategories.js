/**
 * Created by andreimirica on 16.07.2015.
 */
app.controllerProvider.register('HomeCategories', ['$scope', '$rootScope', 'RootService', '$sce', 'Error', 'Success', function($scope, $rootScope, RootService, $sce, Error, Success) {

    RootService.categories.query().$promise.then(function (resp) {
        $scope.navCategories = Success.getObject(resp);
        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = $scope.navCategories.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 8;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.categoriesFiltered = $scope.navCategories.slice(beginSlice, endSlice);
        });
    });


}]);