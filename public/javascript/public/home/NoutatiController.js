publicControllers.controller('NoutatiController', ['$scope', '$rootScope', 'HomeService', '$sce', function($scope, $rootScope, HomeService, $sce) {

    HomeService.contentByType.query({type: 1}).$promise.then(function (resp) {
        $scope.noutati = resp;
        console.log(resp);
    });

}]);