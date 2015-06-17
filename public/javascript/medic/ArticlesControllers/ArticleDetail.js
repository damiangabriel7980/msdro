controllers.controller('ArticleDetail', ['$scope', '$rootScope', '$stateParams', 'ContentService', 'FormatService', '$sce','$state','$window','$timeout', function($scope, $rootScope, $stateParams, ContentService, FormatService, $sce,$state,$window,$timeout){
    var imagePre = $rootScope.pathAmazonDev;
    $scope.currentArticle={
      title: '',
        author: '',
        text: ''
    };
    $scope.backToArticles=function(){
        if($stateParams.articleType<3)
            $state.go('noutati.listaArticole',{articleType:$stateParams.articleType});
        else
            $state.go('biblioteca.articoleStiintifice.listaArticole',{articleType:$stateParams.articleType});
    };
    ContentService.getById.query({content_id: $stateParams.articleId,specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        if(resp._id)
        {
            $scope.currentArticle = resp;
            $scope.date = FormatService.formatMongoDate(resp.last_updated);
            $scope.image = imagePre + resp.image_path;
            $scope.articleContent = $sce.trustAsHtml(resp.text);
        }
       else
        {
            $scope.backToArticles();
        }
    });
}]);