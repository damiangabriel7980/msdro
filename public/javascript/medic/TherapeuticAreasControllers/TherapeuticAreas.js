/**
 * @ngdoc controller
 * @name controllers.controller:therapeuticControllerCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


controllers.controller('TherapeuticAreas', ['$scope', 'therapeuticAreas','$sce','$state', function($scope, therapeuticAreas,$sce,$state){

    $scope.selectedArea = 0;

    therapeuticAreas.areas.query().$promise.then(function(areas){
       $scope.therapeuticAreas = therapeuticAreas.formatAreas(areas);
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
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