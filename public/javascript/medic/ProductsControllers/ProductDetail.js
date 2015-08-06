/**
 * Created by miricaandrei23 on 03.11.2014.
 */
app.controllerProvider.register('ProductDetail', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout','$state', 'Success', 'Error', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout,$state,Success,Error) {
    $scope.selectedProduct={
      name: '',
        description: '',
        image_path: ''
    };
     ProductService.products.query({idProduct:$stateParams.id}).$promise.then(function(result){
         if(Success.getObject(result)._id)
         {
             $scope.selectedProduct = Success.getObject(result);
         }
         else
            $state.go('biblioteca.produse.productsByArea',{id:0});
     });

    $scope.backToProducts = function () {
        $state.go("biblioteca.produse.productsByArea", {id: $stateParams.area || 0});
    }

}]);
