controllers.controller('HomeMostRead', ['$scope', '$rootScope', 'ContentService', '$sce', 'Success', 'Error', function($scope, $rootScope, ContentService, $sce, Success, Error) {

    ContentService.content.query({type: 2}).$promise.then(function (resp) {
        $scope.articole = Success.getObject(resp);

        //pagination
        $scope.maxSize = 3;
        $scope.totalItems = $scope.articole.length;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 5;
        $scope.$watch('currentPage', function () {
            var beginSlice = (($scope.currentPage - 1) * $scope.resultsPerPage);
            var endSlice = beginSlice + $scope.resultsPerPage;
            $scope.articoleFiltered = $scope.articole.slice(beginSlice, endSlice);
        });
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });

}]);