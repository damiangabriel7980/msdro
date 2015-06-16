controllers.controller('ProductPageGlossary', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    specialProductService.getSpecialProductGlossary.query({id:$stateParams.product_id}).$promise.then(function(result){
            $scope.specialProductGlossary=result;
    });
}]);
/**
 * Created by miricaandrei23 on 16.02.2015.
 */
