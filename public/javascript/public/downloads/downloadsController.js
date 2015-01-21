publicControllers.controller('DownloadsController', ['$scope', '$rootScope', 'ContentService', '$sce', function($scope, $rootScope, ContentService, $sce) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.contentByType.query({type: 4}).$promise.then(function (resp) {
        $scope.downloads = resp;
    });
    ContentService.mostReadByType.query({type: 4}).$promise.then(function (resp) {
        $scope.mostDownloads = resp;
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