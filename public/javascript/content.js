cloudAdminControllers.controller('ContentController', ['$scope', '$stateParams', 'ContentService', function($scope, $stateParams, ContentService){

    $scope.test = function () {
        console.log("test");
        console.log($stateParams.contentType);
    };
    $scope.content = ContentService.getByType.query({type: $stateParams.contentType});

}]);