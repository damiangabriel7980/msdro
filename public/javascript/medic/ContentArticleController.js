cloudAdminControllers.controller('ContentArticleController', ['$scope', '$rootScope', '$stateParams', 'ContentService', 'FormatService', '$sce','$state','$window','$timeout', function($scope, $rootScope, $stateParams, ContentService, FormatService, $sce,$state,$window,$timeout){
    var imagePre = $rootScope.pathAmazonDev;
    ContentService.getById.query({content_id: $stateParams.articleId}).$promise.then(function (resp) {
        console.log(resp)
        $timeout(function(){
            //if(angular.element(".main-view-container").outerHeight()>angular.element($window).height())
            //    var margin = Math.floor(angular.element(".main-view-container").outerHeight() - angular.element($window).height() - angular.element('#footer').outerHeight());
            //else
            var margin = Math.floor(angular.element($window).height() - angular.element(".main-view-container").outerHeight() - angular.element('#footer').outerHeight()-15);
            angular.element("#footer").css({'margin-top': (margin > 0 ? margin : 10)});
        },300);;
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