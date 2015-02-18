/**
 * Created by miricaandrei23 on 03.11.2014.
 */
cloudAdminControllers.controller('productDetailsController', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout','$state', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout,$state) {

    window.scrollTo(0,0);

     ProductService.getSingle.query({id:$stateParams.id,specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
         if(result._id)
         {
             $scope.selectedProduct = result;
             $scope.ProductDetailsHTML = $sce.trustAsHtml(result.description);
         }
         else
            $state.go('biblioteca.produse.productsByArea',{id:0});
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
