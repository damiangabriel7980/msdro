/**
 * Created by miricaandrei23 on 03.11.2014.
 */
controllers.controller('ProductDetail', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$window','$timeout','$state', 'Success', 'Error', function($scope,$rootScope,ProductService,$stateParams,$sce,$window,$timeout,$state,Success,Error) {
    window.scrollTo(0,0);
    $scope.selectedProduct={
      name: '',
        description: '',
        image_path: ''
    };
     ProductService.products.query({idProduct:$stateParams.id,specialGroup: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
         if(Success.getObject(result)._id)
         {
             $scope.selectedProduct = Success.getObject(result);
         }
         else
            $state.go('biblioteca.produse.productsByArea',{id:0});
     }).catch(function(err){
         console.log(Error.getMessage(err.data));
     });

}]);
