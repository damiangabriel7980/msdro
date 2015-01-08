/**
 * Created by miricaandrei23 on 07.01.2015.
 */
cloudAdminControllers.controller('HomeSearchController', ['$scope', '$rootScope', 'HomeService', '$sce','$animate','$stateParams', function($scope, $rootScope, HomeService, $sce,$animate,$stateParams) {
    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };
    $scope.trustDescription = function(text){
        return $sce.trustAsHtml(text);
    };
    $scope.amazon = $rootScope.pathAmazonDev;
    HomeService.getSearchResults.query({data:$stateParams.data}).$promise.then(function(response){
       $scope.products = response.products;
        $scope.quizes= response.quizes;
        $scope.multimedia=response.multimedia;
        $scope.articles=response.articles;
        $scope.calendarEv = response['calendar-events'];
    });
    $scope.sref=function(artType){
        if(artType < 3)
            return "noutati.articol({articleType:article.type,articleId:article._id})";
        else
            return "biblioteca.articoleStiintifice.articol({articleType:article.type,articleId:article._id})";
    };
    $scope.defaultImageVideo= $rootScope.pathAmazonDev + "resources/video.png";
    $scope.defaultImageSlide= $rootScope.pathAmazonDev + "multimedia/4/slide/multimedia_88.png";
}])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });
