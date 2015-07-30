/**
 * Created by miricaandrei23 on 07.01.2015.
 */
app.controllerProvider.register('Search', ['$scope', '$state', '$rootScope', 'HomeService', '$sce','$animate','$stateParams','$window','$timeout', 'Success', 'SpecialFeaturesService', function($scope, $state, $rootScope, HomeService, $sce,$animate,$stateParams,$window,$timeout,Success,SpecialFeaturesService) {

    SpecialFeaturesService.specialGroups.getSelected().then(function (specialGroupSelected) {
        getResults(specialGroupSelected);
    });

    var getResults = function (specialGroupSelected) {
        HomeService.getSearchResults.query({data:$stateParams.textToSearch.toString(),specialGroupSelected: specialGroupSelected?specialGroupSelected._id.toString():null}).$promise.then(function(response){
            var results = Success.getObject(response);
            $scope.products = results.products;
            $scope.multimedia = results.multimedia;
            $scope.articles= results.articles;
            $scope.calendarEv= results['calendar-events'];
            $scope.resultsCount = results.products.length + results.multimedia.length + results.articles.length + results['calendar-events'].length;
        });
    };

    $scope.sref=function(artType){
        if(artType < 3)
            return "noutati.articol({articleType:article.type,articleId:article._id,searchTerm:$stateParams.textToSearch})";
        else
            return "biblioteca.articoleStiintifice.articol({articleType:article.type,articleId:article._id,})";
    };

    $scope.navigateToProduct = function (product) {
        $state.go('biblioteca.produse.prodById', {id:product._id});
    };

    $scope.navigateToEvent = function (event) {
        $state.go('calendar', ({id: event._id}));
    };

    $scope.navigateToArticle = function (article) {
        if(article.type == 3){
            $state.go("biblioteca.articoleStiintifice.articol", {articleType: article.type, articleId: article._id, searchTerm: $stateParams.textToSearch.toString()});
        }else{
            $state.go("noutati.articol", {articleType: article.type, articleId: article._id, searchTerm: $stateParams.textToSearch.toString()});
        }
    };

    $scope.navigateToMultimedia = function (multimedia) {
        $state.go("elearning.multimedia.multimediaByArea", {idArea:0,idMulti: multimedia._id});
    };

}]);
