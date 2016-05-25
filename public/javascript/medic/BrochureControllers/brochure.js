/**
 * Created by andreimirica on 17.05.2016.
 */
app.controllerProvider.register('brochureSections', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'Success', 'Error', 'brochureService', function($scope, $rootScope, $stateParams, $state, $timeout, Success, Error, brochureService){

    brochureService.sections.query().$promise.then(function(response){
        $scope.brochureSections = Success.getObject(response);
    });

}]);