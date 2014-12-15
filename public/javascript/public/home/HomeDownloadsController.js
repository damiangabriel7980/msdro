publicControllers.controller('HomeDownloadsController', ['$scope', '$rootScope', 'HomeService', '$sce', function($scope, $rootScope, HomeService, $sce) {

    HomeService.contentByType.query({type: 3}).$promise.then(function (resp) {
        $scope.downloads = resp;
        console.log(resp);
    });

}]);