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

    $scope.therapeuticAreas = therapeuticAreaService.query();

 }]);



