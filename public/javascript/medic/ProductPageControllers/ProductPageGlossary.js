controllers.controller('ProductPageGlossary', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', 'Success', 'Error', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window,Success,Error){
    specialProductService.SpecialProductGlossary.query({id:$stateParams.product_id}).$promise.then(function(result){
            $scope.specialProductGlossary = Success.getObject(result);
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });
}]);
/**
 * Created by miricaandrei23 on 16.02.2015.
 */
