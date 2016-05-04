/**
 * Created by andreimirica on 28.04.2016.
 */
controllers.controller('MainMenu', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'Success', 'Error', 'PathologiesService', function($scope, $rootScope, $stateParams, $state, $timeout, Success, Error, PathologiesService){

    PathologiesService.pathologies.query().$promise.then(function(response){
        $scope.pathologies = Success.getObject(response);
    });

}]);