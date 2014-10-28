cloudAdminControllers.controller('ContentController', ['$scope', '$rootScope', '$stateParams', 'ContentService', function($scope, $rootScope, $stateParams, ContentService){

    $scope.test = function () {
        console.log($stateParams.articleType);
    };
    $scope.test();
    $scope.imagePre = $rootScope.pathAmazonDev;

    switch($stateParams.articleType){
        case 1: $scope.title = "articole";
            break;
        case 2: $scope.title = "articole legislative";
            break;
        case 3: $scope.title = "articole stiintifice";
            break;
    }

    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
    };

    $scope.createHeader = function (text,length) {
        return htmlToPlainText(text).substring(0,length)+"...";
//        return text.substring(0,length);
    };

    $scope.content = ContentService.getByType.query({content_type: $stateParams.articleType});

}]);