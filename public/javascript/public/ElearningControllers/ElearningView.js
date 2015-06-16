controllers.controller('ElearningView', ['$scope', '$rootScope', 'ContentService', '$sce', '$stateParams', 'therapeuticAreas', function($scope, $rootScope, ContentService, $sce, $stateParams, therapeuticAreas) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    therapeuticAreas.areas.query().$promise.then(function (resp) {
        $scope.tpa = therapeuticAreas.formatAreas(resp);

        $scope.$watch('$stateParams', function (val) {
            $scope.selectedArea = $stateParams.area;
            ContentService.content.query({type: 3, area: $stateParams.area, withFile: true}).$promise.then(function (resp) {
                $scope.elearning = resp.success;
            });
        });

    });

}]);