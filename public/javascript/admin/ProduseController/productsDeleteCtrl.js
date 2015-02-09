/**
 * Created by miricaandrei23 on 09.02.2015.
 */
cloudAdminControllers.controller('productsDeleteCtrl', ['$scope','ProductService','idToEdit','$modalInstance','$state','therapeuticAreaService', function($scope,ProductService,idToEdit,$modalInstance,$state,therapeuticAreaService){
    $scope.statusAlert = {newAlert:false, message:""};
    $scope.deleteProduct = function(){
        ProductService.deleteOrUpdateProduct.delete({id:idToEdit}).$promise.then(function(result){
            $scope.statusAlert.newAlert=true;
            $scope.statusAlert.message = result.message;
        })
    };
    $scope.closeModal=function(){
        $state.go('continut.produse',{},{reload: true});
        $modalInstance.close();
    }



}]);
