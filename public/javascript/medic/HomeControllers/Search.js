/**
 * Created by miricaandrei23 on 07.01.2015.
 */
controllers.controller('Search', ['$scope', '$state', '$rootScope', 'HomeService', '$sce','$animate','$stateParams','$window','$timeout', 'Success', 'Error', function($scope, $state, $rootScope, HomeService, $sce,$animate,$stateParams,$window,$timeout,Success,Error) {
    HomeService.getSearchResults.query({data:$stateParams.textToSearch.toString(),specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(response){
        $scope.answer = "";
        if(!Success.getObject(response).isEmpty) {
            $scope.products = Success.getObject(response).products;
            $scope.multimedia = Success.getObject(response).multimedia;
            $scope.articles= Success.getObject(response).articles;
            $scope.calendarEv= Success.getObject(response)['calendar-events'];
        }
        else
            $scope.answer = Success.getMessage(response);
    }).catch(function(err){
        console.log(Error.getMessage(err));
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
