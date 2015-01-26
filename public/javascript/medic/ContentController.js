cloudAdminControllers.controller('ContentController', ['$scope', '$rootScope', '$stateParams', 'ContentService','$timeout','$window', function($scope, $rootScope, $stateParams, ContentService,$timeout,$window){

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.lmt=5;
    $scope.widthOfWindow=$(window).innerWidth;
    $scope.increaseLimit=function(){
        $scope.lmt+=5;
        if($scope.content.length<=$scope.lmt)
            $scope.showMore='hide';
    };
    if($stateParams.articleType==1){
        $scope.title = "STIRI";
        $scope.sr = "noutati.articol({articleType:cont.type, articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }
    if($stateParams.articleType==2){
        $scope.title = "STIRI LEGISLATIVE";
        $scope.sr = "noutati.articol({articleType:cont.type, articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }
    if($stateParams.articleType==3){
        $scope.title = "ARTICOLE STIINTIFICE";
        $scope.sr = "biblioteca.articoleStiintifice.articol({articleType:cont.type, articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }

    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.screenW = $(window).width();

    $(window).on('resize', function () {
        $scope.screenW = $(window).width();
    });

    ContentService.getByType.query({content_type: $stateParams.articleType, specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.content = result;
        console.log($stateParams);
        if($scope.content.length>5)
        {
            $scope.showMore='show';
        }
        else
        {
            $scope.showMore='hide';
        }
        if($scope.content.length>=5)
            angular.element("#footer").css({'position': 'fixed','bottom':0});

    });
}]);