/**
 * Created by miricaandrei23 on 13.02.2015.
 */
controllers.controller('ProductPageDownloads', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce){
    specialProductService.getSpecialProductFiles.query({id:$stateParams.product_id}).$promise.then(function(files){
        $scope.specialProductFiles=files;
    });

    $scope.printPage=function(){
        window.print();
    };
}]);