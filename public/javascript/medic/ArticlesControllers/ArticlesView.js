controllers.controller('ArticlesView', ['$scope', '$rootScope', '$stateParams', 'ContentService','$timeout','$window','$document','$sce', function($scope, $rootScope, $stateParams, ContentService,$timeout,$window,$document,$sce){

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
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').replace(/&acirc;/g,'â').replace(/&icirc;/g,'î').replace(/&#351;/g,'ş').replace(/&Acirc;/g,'Â').replace(/&Icirc;/g,'Î');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.screenW = $(window).width();

    $(window).on('resize', function () {
        $scope.screenW = $(window).width();
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data,limit) {
        if(limit!=0)
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ').substring(0,limit) + '...';
        else
            var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };
    ContentService.getByType.query({content_type: $stateParams.articleType, specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        $scope.content = result;
        $timeout(function(){
            var footer = angular.element('#footer');
            var check = function () {
                //if(angular.element($window).scrollTop()===0&&angular.element($document).height() >= (angular.element($window).height() + angular.element($window).scrollTop()))
                //    f.hide();
                if (angular.element($document).height() <= (angular.element($window).height() + angular.element($window).scrollTop()))
                    footer.show();
                else
                    footer.hide();
            };
            var appliedCheck = function () {
                $scope.$apply(check);
            };
            appliedCheck();
        },50);
        //if(angular.element($window).scrollTop()===0&&angular.element($document).height() >= (angular.element($window).height() + angular.element($window).scrollTop()))
        //    angular.element('#footer').hide();
        if($scope.content.length>5)
        {
            $scope.showMore='show';
        }
        else
        {
            $scope.showMore='hide';
        }
        if($scope.content.length===0){
            if($stateParams.articleType<3)
                $scope.message="Nu exista stiri!";
            else
                $scope.message="Nu exista articole stiintifice!";
        }

    });
}]);