controllers.controller('ElearningView', ['$scope', '$state', '$rootScope', 'ContentService', '$sce', '$stateParams', 'therapeuticAreas', function($scope, $state, $rootScope, ContentService, $sce, $stateParams, therapeuticAreas) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    therapeuticAreas.areas.query().$promise.then(function (resp) {
        $scope.tpa = therapeuticAreas.formatAreas(resp);

        $scope.$watch('$stateParams', function (val) {
            $scope.selectedArea = $stateParams.area;
            ContentService.content.query({type: 3, area: $stateParams.area, withFile: true}).$promise.then(function (resp) {
                $scope.elearning = resp.success;
            }).catch(function(errElearning){
                console.log(errElearning.data.error);
            });
        });

    }).catch(function(errTherap){
        console.log(errTherap.data.error);
    });

    $scope.navigateToElearning = function (content) {
        $state.go('elearning.detail', {id: content._id});
    };

    $scope.getAuthor = function (content) {
        return content.author;
    };


}]);