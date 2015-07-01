controllers.controller('ArticlesDetail', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', function($scope, $rootScope, ContentService, $sce, $stateParams) {

    ContentService.content.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.currentArticle = resp.success;
    }).catch(function(err){
        console.log(err.data.error);
    });

}]);