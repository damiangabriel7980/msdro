/**
 * @ngdoc controller
 * @name cloudAdminControllers.controller:therapeuticControllerCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


cloudAdminControllers.controller('therapeuticControllerCtrl', function($scope, $http) {

    $scope.init = function() {

        $http.get('javascript/Therapeutic_Areas.json').
            success(function(data, status, headers, config) {
                $scope.areas = data;
            }).
            error(function(data, status, headers, config) {
                // log error
            });
    };

    $scope.init();


});
