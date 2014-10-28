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
cloudAdminControllers.controller('productsController', ['$scope','$rootScope' ,'ProductService','$stateParams', function($scope,$rootScope,ProductService,$stateParams){

    $scope.allAreas=1;
    $scope.filtProd=ProductService.getByArea.query($stateParams.area_parent)
    $scope.products = ProductService.query();
    $scope.amazon = $rootScope.pathAmazonDev;

}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    });



