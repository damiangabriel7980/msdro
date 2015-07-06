controllers.controller('ArticlesView', ['$scope', '$rootScope', '$state', '$stateParams', 'ContentService', 'Success', 'Error', function($scope, $rootScope, $state, $stateParams, ContentService,Success,Error){
    $scope.lmt=5;
    $scope.increaseLimit=function(){
        $scope.lmt+=5;
    };
    if($stateParams.articleType==1){
        $scope.title = "STIRI NATIONALE";
    }
    if($stateParams.articleType==2){
        $scope.title = "STIRI INTERNATIONALE";
    }
    if($stateParams.articleType==3){
        $scope.title = "ARTICOLE STIINTIFICE";
    }
    ContentService.content.query({content_type: $stateParams.articleType, specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.content = Success.getObject(result);
        $scope.mostRead = Success.getObject(result).slice(0, 3);
        if($scope.content.length===0){
            if($stateParams.articleType<3)
                $scope.message="Nu exista stiri!";
            else
                $scope.message="Nu exista articole stiintifice!";
        }

    }).catch(function(err){
        console.log(Error.getMessage(err));
    });
    $scope.navigateToContent = function (content) {
        var stateName;
        if($stateParams.articleType == 1 || $stateParams.articleType == 2){
            stateName = "noutati.articol";
        }else{
            stateName = "biblioteca.articoleStiintifice.articol";
        }
        $state.go(stateName, {articleType: content.type, articleId: content._id});
    }
}]);