cloudAdminControllers.controller('specialProductGlossaryCtrl', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    specialProductService.getSpecialProductGlossary.query({id:$stateParams.product_id}).$promise.then(function(result){
            $scope.specialProductGlossary=result;
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
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
/**
 * Created by miricaandrei23 on 16.02.2015.
 */
