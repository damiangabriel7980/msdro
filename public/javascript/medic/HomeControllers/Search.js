/**
 * Created by miricaandrei23 on 07.01.2015.
 */
controllers.controller('Search', ['$scope', '$rootScope', 'HomeService', '$sce','$animate','$stateParams','$window','$timeout', function($scope, $rootScope, HomeService, $sce,$animate,$stateParams,$window,$timeout) {
    HomeService.getSearchResults.query({data:$stateParams.textToSearch.toString(),specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(response){
        $scope.answer="";
        if(!response.answer) {
            $scope.products = response.products;
            $scope.multimedia = response.multimedia;
            $scope.articles= response.articles;
            $scope.calendarEv= response['calendar-events'];
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
    $scope.defaultImageVideo= $rootScope.pathAmazonDev + "resources/video.png";
    $scope.defaultImageSlide= $rootScope.pathAmazonDev + "multimedia/4/slide/multimedia_88.png";
}]);
