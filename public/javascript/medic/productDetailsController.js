/**
 * Created by miricaandrei23 on 03.11.2014.
 */
cloudAdminControllers.controller('productDetailsController', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout) {

    window.scrollTo(0,0);

     ProductService.getSingle.query({id:$stateParams.id}).$promise.then(function(result){
         $scope.selectedProduct = result;
         $scope.ProductDetailsHTML = $sce.trustAsHtml(result.description);
     });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.convertAndTrustAsHtml=function (data) {
        var convertedText = String(data).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        return $sce.trustAsHtml(convertedText);
    };

    $scope.amazon = $rootScope.pathAmazonDev;
}]);
