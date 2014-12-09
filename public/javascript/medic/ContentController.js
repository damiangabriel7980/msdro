cloudAdminControllers.controller('ContentController', ['$scope', '$rootScope', '$stateParams', 'ContentService', function($scope, $rootScope, $stateParams, ContentService){

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.lmt=3;
    $scope.increaseLimit=function(){
        $scope.lmt+=3;
    };
    if($stateParams.articleType==1){
        $scope.title = "articole";
        $scope.sr = "noutati.articol({articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }
    if($stateParams.articleType==2){
        $scope.title = "articole legislative";
        $scope.sr = "noutati.articol({articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }
    if($stateParams.articleType==3){
        $scope.title = "articole stiintifice";
        $scope.sr = "biblioteca.articoleStiintifice.articol({articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }

    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.content = ContentService.getByType.query({content_type: $stateParams.articleType, specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null});

}]);