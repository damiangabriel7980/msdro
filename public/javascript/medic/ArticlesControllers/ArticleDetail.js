app.controllerProvider.register('ArticleDetail', ['$scope', '$rootScope', '$stateParams', 'ContentService', 'FormatService', '$sce','$state','$window','$timeout', 'Success', 'Error', function($scope, $rootScope, $stateParams, ContentService, FormatService, $sce,$state,$window,$timeout,Success,Error){
    $scope.currentArticle={
      title: '',
        author: '',
        text: ''
    };

    $scope.backToArticles=function(){
        if($stateParams.searchTerm){
            $state.go('homeSearch',{textToSearch : $stateParams.searchTerm},{reload: true});
        }else{
            if($stateParams.articleType<3)
                $state.go('noutati.listaArticole',{articleType:$stateParams.articleType});
            else
                $state.go('biblioteca.articoleStiintifice.listaArticole',{articleType:$stateParams.articleType});
        }
    };
    ContentService.content.query({content_id: $stateParams.articleId,specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function (resp) {
        var article = Success.getObject(resp);
        if(article._id)
        {
            $scope.currentArticle = article;
            $scope.date = FormatService.formatMongoDate(article.last_updated);
        }
       else
        {
            $scope.backToArticles();
        }
    });
}]);