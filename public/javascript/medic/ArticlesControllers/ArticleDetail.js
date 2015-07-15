app.controllerProvider.register('ArticleDetail', ['$scope', '$rootScope', '$stateParams', 'ContentService', 'FormatService', '$sce','$state','$window','$timeout', 'Success', 'SpecialFeaturesService', function($scope, $rootScope, $stateParams, ContentService, FormatService, $sce,$state,$window,$timeout,Success,SpecialFeaturesService){
    $scope.currentArticle={
      title: '',
        author: '',
        text: ''
    };

    ContentService.content.query({content_id: $stateParams.articleId}).$promise.then(function (resp) {
        var article = Success.getObject(resp);
        if(article._id)
        {
            $scope.currentArticle = article;
            $scope.date = FormatService.formatMongoDate(article.last_updated);
        }
        else
        {
            $state.go('home',{},{reload: true});
        }
    });

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

}]);