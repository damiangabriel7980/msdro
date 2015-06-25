controllers.controller('ProductPageGlossary', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    specialProductService.SpecialProductGlossary.query({id:$stateParams.product_id}).$promise.then(function(result){
            $scope.specialProductGlossary=result.success;
    });
}]);
/**
 * Created by miricaandrei23 on 16.02.2015.
 */
