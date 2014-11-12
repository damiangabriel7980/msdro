/**
 * @ngdoc controller
 * @name cloudAdminControllers.controller:therapeuticControllerCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


cloudAdminControllers.controller('therapeuticControllerCtrl', ['$scope', 'therapeuticAreaService', function($scope, therapeuticAreaService){

   therapeuticAreaService.query().$promise.then(function(correctResults){
       $scope.therapeuticAreas = correctResults;
    });

 }]);



