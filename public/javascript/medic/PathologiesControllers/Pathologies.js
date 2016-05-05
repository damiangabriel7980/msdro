/**
 * Created by andreimirica on 05.05.2016.
 */
app.controllerProvider.register('PathologiesController', ['$scope', 'PathologiesService','$sce','$state', 'Success', function($scope, PathologiesService, $sce,$state, Success){

    $scope.selectedPathology = 0;

    PathologiesService.pathologies.query().$promise.then(function(resp){
        $scope.allPathologies = Success.getObject(resp);
        $scope.allPathologies.unshift({_id: 0, display_name: 'Toate patologiile'})
    });

    $scope.selectPathology = function(id){
        $scope.selectedPathology = id;
        if($state.includes('biblioteca')){
            $state.go('biblioteca.produse.productsByArea', {id: id});
        }else{
            $state.go('elearning.multimedia.multimediaByArea', {idArea: id});
        }
    };

}]);