controllers.controller('ArticlesView', ['$scope', '$rootScope', '$stateParams', 'ContentService','$timeout','$window','$document','$sce', function($scope, $rootScope, $stateParams, ContentService,$timeout,$window,$document,$sce){
    $scope.lmt=5;
    $scope.increaseLimit=function(){
        $scope.lmt+=5;
        if($scope.content.length<=$scope.lmt)
            $scope.showMore='hide';
    };
    if($stateParams.articleType==1){
        $scope.title = "STIRI NATIONALE";
        $scope.sr = "noutati.articol({articleType:cont.type, articleId:cont._id})";
    }
    if($stateParams.articleType==2){
        $scope.title = "STIRI INTERNATIONALE";
        $scope.sr = "noutati.articol({articleType:cont.type, articleId:cont._id})";
    }
    if($stateParams.articleType==3){
        $scope.title = "ARTICOLE STIINTIFICE";
        $scope.sr = "biblioteca.articoleStiintifice.articol({articleType:cont.type, articleId:cont._id})";
    }
    ContentService.getByType.query({content_type: $stateParams.articleType, specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.content = result;
        $scope.showMore = $scope.content.length>5?'show':'hide';
        if($scope.content.length===0){
            if($stateParams.articleType<3)
                $scope.message="Nu exista stiri!";
            else
                $scope.message="Nu exista articole stiintifice!";
        }

    });
}]);