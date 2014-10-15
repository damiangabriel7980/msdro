/**
 * @ngdoc controller
 * @name cloudAdminControllers.controller:science_articlesCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


cloudAdminControllers.controller('productsController', ['$scope', 'ProductService', function($scope, ProductService){

    $scope.newProduct = {
        id_product: "",
        version_prod: "",
        description: "",
        enableP:      "",
        file_path:   "",
        image_path:  "",
        last_updated: "",
        nameP: ""
    };

    $scope.products = ProductService.query();

    $scope.deleteProduct = function(id){
        ProductService.delete({id: id});
        $scope.products = $scope.products.filter(function(cont){ return (cont._id_product != id); });
    };

    $scope.addProduct = function(){
        if($scope.newProduct){
            ProductService.save($scope.newProduct).$promise
                .then(function(cont) {
                    $scope.products.push(cont);
                });
            $scope.newProduct = {};
        }
    };

}]);
