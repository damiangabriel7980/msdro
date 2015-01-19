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
       $scope.productsFirstSet = response.products;
        $scope.products=[];
        $scope.quizes=[];
        $scope.multimedia=[];
        $scope.articles=[];
        $scope.calendarEv=[];
        for(var i=0;i<$scope.productsFirstSet.length;i++)
        {
            if($scope.productsFirstSet[i]!=null)
                $scope.products.push($scope.productsFirstSet[i]);
        }

        $scope.quizesFirstSet= response.quizes;
        for(var i=0;i<$scope.quizesFirstSet.length;i++)
        {
            if($scope.quizesFirstSet[i]!=null)
                $scope.quizes.push($scope.quizesFirstSet[i]);
        }

        $scope.multimediaFirstSet=response.multimedia;
        for(var i=0;i<$scope.multimediaFirstSet.length;i++)
        {
            if($scope.multimediaFirstSet[i]!=null)
                $scope.multimedia.push($scope.multimediaFirstSet[i]);
        }

        $scope.articlesFirstSet=response.articles;
        for(var i=0;i<$scope.articlesFirstSet.length;i++)
        {
            if($scope.articlesFirstSet[i]!=null)
                $scope.articles.push($scope.articlesFirstSet[i]);
        }
        $scope.calendarEvFirstSet = response['calendar-events'];
        for(var i=0;i<$scope.calendarEvFirstSet.length;i++)
        {
            if($scope.calendarEvFirstSet[i]!=null)
                $scope.calendarEv.push($scope.calendarEvFirstSet[i]);
        }
    });
    $scope.sref=function(artType){
        if(artType < 3)
            return "noutati.articol({articleType:article.type,articleId:article._id})";
        else
            return "biblioteca.articoleStiintifice.articol({articleType:article.type,articleId:article._id})";
    };
    $scope.showDetails="hide";
    $scope.defaultImageVideo= $rootScope.pathAmazonDev + "resources/video.png";
    $scope.defaultImageSlide= $rootScope.pathAmazonDev + "multimedia/4/slide/multimedia_88.png";
    $scope.clasicPreview = function(){
        $scope.showDetails="hide";
    };
    $scope.detailedPreview = function(){
        $scope.showDetails="show";
    };
}])
    .filter('unsafe', function($sce) { return $sce.trustAsHtml; });
