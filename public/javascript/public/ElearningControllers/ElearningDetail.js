app.controllerProvider.register('ElearningDetail', ['$scope', '$state', '$rootScope', 'ContentService', '$stateParams', '$sce', 'Error', 'Success', function($scope, $state, $rootScope, ContentService, $stateParams, $sce, Error, Success) {

    ContentService.content.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.elearning = Success.getObject(resp);
        $scope.videoConfig = {
            sources: [{src: $sce.trustAsResourceUrl($rootScope.pathAmazonDev+$scope.elearning.file_path), type: "video/mp4"}],
            theme: "components/videogular-themes-default/videogular.css",
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            },
            autoPlay: true
        };
    });

    $scope.goBack = function () {
        $state.go("elearning.all", {area: $stateParams.area || 0});
    }

}]);