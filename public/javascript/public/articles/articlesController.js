publicControllers.controller('ArticlesController', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.articlesLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.contentByType.query({type: 2}).$promise.then(function (resp) {
        $scope.news = resp;
    });
    ContentService.mostReadByType.query({type: 2}).$promise.then(function (resp) {
        $scope.mostRead = resp;
    });

    //------------------------------------------------------------------------------------------------ useful functions

    $scope.htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };

    $scope.createHeader = function (text,length) {
        return $scope.htmlToPlainText(text).substring(0,length)+"...";
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };

}]);