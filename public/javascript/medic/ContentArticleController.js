cloudAdminControllers.controller('ContentArticleController', ['$scope', '$rootScope', '$stateParams', 'ContentService', 'FormatService', '$sce','$state','$window','$timeout', function($scope, $rootScope, $stateParams, ContentService, FormatService, $sce,$state,$window,$timeout){
    var imagePre = $rootScope.pathAmazonDev;
    ContentService.getById.query({content_id: $stateParams.articleId}).$promise.then(function (resp) {
        console.log(resp)
        $scope.currentArticle = resp;
        $scope.date = FormatService.formatMongoDate(resp.last_updated);
        $scope.image = imagePre + resp.image_path;
        $scope.articleContent = $sce.trustAsHtml(resp.text);
        $scope.backToArticles=function(){
            if($scope.currentArticle.type<3)
                $state.go('noutati.listaArticole',{articleType:$scope.currentArticle.type});
            else
                $state.go('biblioteca.articoleStiintifice.listaArticole',{articleType:$scope.currentArticle.type});
        }
    });



}]);