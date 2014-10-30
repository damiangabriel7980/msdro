cloudAdminControllers.controller('ContentController', ['$scope', '$rootScope', '$stateParams', 'ContentService', function($scope, $rootScope, $stateParams, ContentService){

    $scope.imagePre = $rootScope.pathAmazonDev;

    if($stateParams.articleType=1){
        $scope.title = "articole";
        $scope.sr = "noutati.articol({articleId:cont._id})";
        $scope.btn = "Vezi articol";
    }
    if($stateParams.articleType=2){
        $scope.title = "articole legislative";
        $scope.sr = "noutati.articol({articleId:cont._id})";
        $scope.btn = "Vezi articol";
    }
    if($stateParams.articleType=3){
        $scope.title = "articole stiintifice";
        $scope.sr = "biblioteca.articoleStiintifice.articol({articleId:cont._id})";
        $scope.btn = "Vezi articol";
    }

    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.content = ContentService.getByType.query({content_type: $stateParams.articleType});

}]);