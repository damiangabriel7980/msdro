app.controllerProvider.register('ArticlesDetail', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', 'Error', 'Success', function($scope, $rootScope, ContentService, $sce, $stateParams, Error, Success) {

    ContentService.content.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.currentArticle = Success.getObject(resp);
    });

}]);