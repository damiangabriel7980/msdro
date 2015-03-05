/**
 * Created by miricaandrei23 on 17.02.2015.
 */
controllers.controller('ProductPageMap', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    specialProductService.getSpecialProductMenu.query({id:$stateParams.product_id}).$promise.then(function(resp){
        $scope.specialProductMenu = resp;
    });
    specialProductService.getSpecialProductFiles.query({id:$stateParams.product_id}).$promise.then(function(files){
        $scope.specialProductFiles=files;
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.printPage=function(){
        window.print();
    };
}]);