/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('productsEditCtrl', ['$scope','$rootScope' ,'ProductService','$stateParams','$sce','$filter','$modalInstance','$state', function($scope,$rootScope,ProductService,$stateParams,$sce,$filter,$modalInstance,$state){
    ProductService.deleteOrUpdateProduct.getProduct({id:$stateParams.id}).$promise.then(function(result){
        $scope.product=result;
    });


    $scope.updateProduct = function(){
        if($scope.product){
            ProductService.deleteOrUpdateProduct.update({id:$stateParams.id},$scope.product);
            $scope.product = {};
            $state.go('continut.produse');
            $modalInstance.close();
        }
    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
    $scope.okk = function () {
        $state.go('continut.produse');
        $modalInstance.close();
    };
}]);
