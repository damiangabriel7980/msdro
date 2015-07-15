/**
 * @ngdoc controller
 * @name controllers.controller:therapeuticControllerCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


app.controllerProvider.register('TherapeuticAreas', ['$scope', 'therapeuticAreas','$sce','$state', 'Success', function($scope, therapeuticAreas,$sce,$state, Success){

    $scope.selectedArea = 0;

    therapeuticAreas.areas.query().$promise.then(function(resp){
        $scope.therapeuticAreas = therapeuticAreas.formatAreas(Success.getObject(resp));
    });
    $scope.selectArea = function(id){
        $scope.selectedArea = id;
        if($state.includes('biblioteca')){
            $state.go('biblioteca.produse.productsByArea', {id: id});
        }else{
            $state.go('elearning.multimedia.multimediaByArea', {idArea: id});
        }
    };

}]);