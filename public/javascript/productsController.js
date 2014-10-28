/**
 * @ngdoc controller
 * @name cloudAdminControllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


cloudAdminControllers.controller('productsController', ['$scope','$rootScope' ,'ProductService','$stateParams', function($scope,$rootScope,ProductService,$stateParams){

    $scope.allAreas=1;
    $scope.filtProd=[];
    $scope.products = ProductService.getByArea.query({id:$stateParams.id});
    $scope.amazon = $rootScope.pathAmazonDev;
  }])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    });
