cloudAdminControllers.controller('ContentArticleController', ['$scope', '$rootScope', '$stateParams', 'ContentService', function($scope, $rootScope, $stateParams, ContentService){

    $scope.imagePre = $rootScope.pathAmazonDev;

    $scope.currentArticle = ContentService.getById.query({content_id: $stateParams.articleId});
    console.log($scope.currentArticle);

}]);