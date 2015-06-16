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

   therapeuticAreaService.query().$promise.then(function(correctResults){
       $scope.therapeuticAreas = correctResults;
       $scope.therapeuticAreas.push($scope.allAreas);
       $scope.therapeuticAreasMobile = JSON.parse(JSON.stringify($scope.therapeuticAreas));
       $scope.selectedArea=$scope.therapeuticAreasMobile.last();
    });
    Array.prototype.last = function() {
        return this[this.length-1];
    };
    $scope.selectArea = function(){
        $state.go('biblioteca.produse.productsByArea',{id:$scope.selectedArea._id});
    };
    $scope.selectAreaMultimedia=function(){
      $state.go('elearning.multimedia.multimediaByArea',{idArea: $scope.selectedArea._id});
    };
    $scope.allAreas={
        name: "Toate ariile terapeutice",
        _id: 0
    };
    //
    //$scope.toggleActive = function(){
    //    $('.list-group li').removeClass('active');
    //    $(this).addClass('active');
    //}

 }]);



