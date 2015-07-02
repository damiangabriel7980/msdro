controllers.controller('DownloadsView', ['$scope', '$state', '$rootScope', 'ContentService', '$sce', 'Error', 'Success', function($scope, $state, $rootScope, ContentService, $sce, Error, Success) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    ContentService.content.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.downloads = Success.getObject(resp);
    }).catch(function(errDownloads){
        console.log(Error.getMessage(errDownloads.data));
    });
    ContentService.mostRead.query({type: 4, withFile: true}).$promise.then(function (resp) {
        $scope.mostDownloads = Success.getObject(resp);
    }).catch(function(errMostDownloads){
        console.log(Error.getMessage(errMostDownloads.data));
    });

    $scope.navigateToDownloads = function (content) {
        $state.go('downloads.detail', {id: content._id});
    }

}]);