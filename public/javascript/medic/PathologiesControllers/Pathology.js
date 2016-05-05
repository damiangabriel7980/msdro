/**
 * Created by andreimirica on 28.04.2016.
 */
app.controllerProvider.register('PathologyController', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'Success', 'Error', 'PathologiesService', function($scope, $rootScope, $stateParams, $state, $timeout, Success, Error, PathologiesService){

    PathologiesService.pathologies.query({id: $stateParams.pathology_id}).$promise.then(function(response){
        $scope.pathology = Success.getObject(response)[0];
    });

}]);