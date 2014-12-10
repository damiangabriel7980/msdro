cloudAdminControllers.controller('ContentController', ['$scope', '$rootScope', '$stateParams', 'ContentService', function($scope, $rootScope, $stateParams, ContentService){

    $scope.imagePre = $rootScope.pathAmazonDev;
    $scope.lmt=3;
    $scope.widthOfWindow=$(window).innerWidth;
    $scope.increaseLimit=function(){
        $scope.lmt+=3;
    };
    if($stateParams.articleType==1){
        $scope.title = "STIRI";
        $scope.sr = "noutati.articol({articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }
    if($stateParams.articleType==2){
        $scope.title = "STIRI LEGISLATIVE";
        $scope.sr = "noutati.articol({articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }
    if($stateParams.articleType==3){
        $scope.title = "ARTICOLE STIINTIFICE";
        $scope.sr = "biblioteca.articoleStiintifice.articol({articleId:cont._id})";
        $scope.btn = "Vezi stire";
    }

    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.screenW = $(window).width();

    $(window).on('resize', function () {
        $scope.screenW = $(window).width();
    });

    $scope.content = ContentService.getByType.query({content_type: $stateParams.articleType, specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null});

    setTimeout(function(){$("#footer").css({'margin-top': 0});
        var margin = Math.floor($(window).outerHeight() - $(".articlesStyles").outerHeight() - $('#footer').outerHeight() - 80);
        $("#footer").css({'margin-top': (margin > 20 ? margin : 20)});},1000);

    $(document).on('ajaxComplete', function () {
        $("#footer").css({'margin-top': 0});
        var margin = Math.floor($(window).outerHeight() - $(".articlesStyles").outerHeight() - $('#footer').outerHeight() - 80);
        $("#footer").css({'margin-top': (margin > 20 ? margin : 20)});
    });
    $(window).on('resize', function () {
        $scope.screenW = $(window).width();
        $("#footer").css({'margin-top': 0});
        var margin = Math.floor($(window).outerHeight() - $(".articlesStyles").outerHeight() - $('#footer').outerHeight() - 80);
        $("#footer").css({'margin-top': (margin > 20 ? margin : 20)});
    });

}]);