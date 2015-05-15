controllers.controller('ArticleDetail', ['$scope', '$rootScope', '$stateParams', 'ContentService', 'FormatService', '$sce','$state','$window','$timeout', function($scope, $rootScope, $stateParams, ContentService, FormatService, $sce,$state,$window,$timeout){
    var imagePre = $rootScope.pathAmazonDev;
    $scope.currentArticle={
      title: '',
        author: '',
        text: ''
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
            if($stateParams.articleType<3)
                $state.go('noutati.listaArticole',{articleType:$stateParams.articleType});
            else
                $state.go('biblioteca.articoleStiintifice.listaArticole',{articleType:$stateParams.articleType});
        }
        $scope.backToArticles=function(){
            if($scope.currentArticle.type<3)
                $state.go('noutati.listaArticole',{articleType:$scope.currentArticle.type});
            else
                $state.go('biblioteca.articoleStiintifice.listaArticole',{articleType:$scope.currentArticle.type});
        }
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
}]);