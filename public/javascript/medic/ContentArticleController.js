cloudAdminControllers.controller('ContentArticleController', ['$scope', '$rootScope', '$stateParams', 'ContentService', 'FormatService', '$sce', function($scope, $rootScope, $stateParams, ContentService, FormatService, $sce){

    var imagePre = $rootScope.pathAmazonDev;

    ContentService.getById.query({content_id: $stateParams.articleId}).$promise.then(function (resp) {
        console.log(resp);
        $scope.currentArticle = resp;
        $scope.date = FormatService.formatMongoDate(resp.last_updated);
        $scope.image = imagePre + resp.image_path;
        $scope.articleContent = $sce.trustAsHtml(resp.text);
    });

}]);