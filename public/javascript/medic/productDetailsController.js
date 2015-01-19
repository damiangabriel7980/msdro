/**
 * Created by miricaandrei23 on 03.11.2014.
 */
cloudAdminControllers.controller('productDetailsController', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce', function($scope,$rootScope,ProductService,$stateParams,$sce) {

    window.scrollTo(0,0);

     ProductService.getSingle.query({id:$stateParams.id}).$promise.then(function(result){
         $scope.selectedProduct = result;
         $scope.ProductDetailsHTML = $sce.trustAsHtml(result.description);
     });

    $scope.amazon = $rootScope.pathAmazonDev;
}]);
