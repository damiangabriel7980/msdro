/**
 * Created by andreimirica on 05.05.2016.
 */
app.controllerProvider.register('PathologiesController', ['$scope', 'PathologiesService','$sce','$state', 'Success', '$stateParams', function($scope, PathologiesService, $sce,$state, Success, $stateParams){

    $scope.selectedPathology = $state.params.idPathology ? $state.params.idPathology : $state.params.idArea;

    PathologiesService.pathologies.query().$promise.then(function(resp){
        $scope.allPathologies = Success.getObject(resp);
        $scope.allPathologies.unshift({_id: 0, display_name: 'Toate patologiile'})
    });

    $scope.selectPathology = function(id){
        $scope.selectedPathology = id;
        switch ($stateParams.navigateToState) {
            case 'products' :
                $state.go('biblioteca.produse.productsByArea', {id: id});
                break;
            case 'events' :
                $state.go('calendar.events.event', {idArea: id});
                break;
            case 'multimedia' :
                $state.go('elearning.multimedia.multimediaByArea', {idArea: id});
                break;
            case 'productList':
                $state.go('productList.all.groupedByPathology', {idArea: id}, {inherit: false,reload: true});
                break;
        }
    };

}]);