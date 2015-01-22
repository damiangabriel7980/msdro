publicControllers.controller('ArticlesDetailController', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', function($scope, $rootScope, ContentService, $sce, $stateParams) {

    ContentService.contentById.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.currentArticle = resp;
    });

    //------------------------------------------------------------------------------------------------ useful functions

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };

}]);