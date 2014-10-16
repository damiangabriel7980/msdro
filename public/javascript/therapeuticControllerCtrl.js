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

    $scope.newTherapeuticArea = {
        version_ther:     "",
        has_children: "",
        last_updated: "",
        name: "",
        parent_id: "",
        enable:      ""
    };

    $scope.therapeuticAreas = therapeuticAreaService.query();

    $scope.deleteTherapeuticArea = function(id){
        therapeuticAreaService.delete({id: id});
        $scope.therapeuticAreas = $scope.therapeuticAreas.filter(function(cont){ return (cont._id != id); });
    };

    $scope.addTherapeuticArea = function(){
        if($scope.newTherapeuticArea){
            therapeuticAreaService.save($scope.newTherapeuticArea).$promise
                .then(function(cont) {
                    $scope.therapeuticAreas.push(cont);
                });
            $scope.newTherapeuticArea = {};
        }
    };

 }]);


