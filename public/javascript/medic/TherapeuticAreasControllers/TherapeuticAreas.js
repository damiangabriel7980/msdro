/**
 * @ngdoc controller
 * @name controllers.controller:therapeuticControllerCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


controllers.controller('TherapeuticAreas', ['$scope', 'therapeuticAreaService','$sce','$state', function($scope, therapeuticAreaService,$sce,$state){

    $scope.selectedArea = 0;

   therapeuticAreaService.areas.query().$promise.then(function(areas){
       $scope.therapeuticAreas = therapeuticAreaService.formatAreas(areas);
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