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
    });
    $scope.selectArea = function(id){
        $scope.selectedArea = id;
        $state.go('biblioteca.produse.productsByArea', {id: id});
    };
    $scope.selectAreaMultimedia=function(id){
        $scope.selectedArea = id;
        $state.go('elearning.multimedia.multimediaByArea', {idArea: id});
    };

}]);