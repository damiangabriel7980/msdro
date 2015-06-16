/**
 * Created by miricaandrei23 on 03.11.2014.
 */
controllers.controller('ProductDetail', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout','$state', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout,$state) {

    window.scrollTo(0,0);
    $scope.selectedProduct={
      name: '',
        description: '',
        image_path: ''
    };
     ProductService.getSingle.query({id:$stateParams.id,specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
         if(result._id)
         {
             $scope.selectedProduct = result;
             //if($scope.selectedProduct.image_path)

             $scope.ProductDetailsHTML = $sce.trustAsHtml(result.description);
         }
         else
            $state.go('biblioteca.produse.productsByArea',{id:0});
     });

}]);
