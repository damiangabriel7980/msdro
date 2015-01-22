publicControllers.controller('ElearningDetailController', ['$scope', '$rootScope', 'ContentService', '$stateParams', function($scope, $rootScope, ContentService, $stateParams) {

    ContentService.contentById.query({id: $stateParams.id}).$promise.then(function (resp) {
        $scope.elearning = resp;
    });

}]);