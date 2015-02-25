/**
 * Created by miricaandrei23 on 13.02.2015.
 */
controllers.controller('ProductPageDownloads', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce){
    specialProductService.getSpecialProductFiles.query({id:$stateParams.product_id}).$promise.then(function(files){
        $scope.specialProductFiles=files;
    });
    specialProductService.getSpecialProduct.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        if(result._id)
            $scope.specialProduct=result;
        else
            $state.go('home');
    });
    $scope.printPage=function(){
        window.print();
    };
}]);