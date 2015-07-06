controllers.controller('ElearningView', ['$scope', '$state', '$rootScope', 'ContentService', '$sce', '$stateParams', 'therapeuticAreas', 'Error', 'Success', function($scope, $state, $rootScope, ContentService, $sce, $stateParams, therapeuticAreas, Error, Success) {

    $scope.contentLimit = 3;

    //------------------------------------------------------------------------------------------------- get all content

    therapeuticAreas.areas.query().$promise.then(function (resp) {
        $scope.tpa = therapeuticAreas.formatAreas(Success.getObject(resp));

        $scope.$watch('$stateParams', function (val) {
            $scope.selectedArea = $stateParams.area;
            ContentService.content.query({type: 3, area: $stateParams.area, withFile: true}).$promise.then(function (resp) {
                $scope.elearning = Success.getObject(resp);
            }).catch(function(errElearning){
                console.log(Error.getMessage(errElearning));
            });
        });

    }).catch(function(errTherap){
        console.log(Error.getMessage(errTherap));
    });

    $scope.navigateToElearning = function (content) {
        $state.go('elearning.detail', {id: content._id});
    };

    $scope.getAuthor = function (content) {
        return content.author;
    };


}]);