/**
 * Created by miricaandrei23 on 07.01.2015.
 */
controllers.controller('Search', ['$scope', '$state', '$rootScope', 'HomeService', '$sce','$animate','$stateParams','$window','$timeout', function($scope, $state, $rootScope, HomeService, $sce,$animate,$stateParams,$window,$timeout) {
    HomeService.getSearchResults.query({data:$stateParams.textToSearch.toString(),specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(response){
        $scope.answer="";
        if(!response.answer) {
            $scope.products = response.success.products;
            $scope.multimedia = response.success.multimedia;
            $scope.articles= response.success.articles;
            $scope.calendarEv= response.success['calendar-events'];
        }
        else
            $scope.answer=response.answer;
    });
    $scope.sref=function(artType){
        if(artType < 3)
            return "noutati.articol({articleType:article.type,articleId:article._id})";
        else
            return "biblioteca.articoleStiintifice.articol({articleType:article.type,articleId:article._id})";
    };

    $scope.navigateToProduct = function (product) {
        $state.go('biblioteca.produse.prodById', {id:product._id});
    };

    $scope.navigateToEvent = function (event) {
        $state.go('calendar', ({id: event._id}));
    };

    $scope.navigateToArticle = function (article) {
        if(article.type == 3){
            $state.go("biblioteca.articoleStiintifice.articol", {articleType: article.type, articleId: article._id});
        }else{
            $state.go("noutati.articol", {articleType: article.type, articleId: article._id});
        }
    };

    $scope.navigateToMultimedia = function (multimedia) {
        $state.go("elearning.multimedia.multimediaByArea", {idArea:0,idMulti: multimedia._id});
    };

}]);
