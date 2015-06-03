/**
 * Created by miricaandrei23 on 17.02.2015.
 */
controllers.controller('ProductPageMap', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.printPage=function(){
        window.print();
    };

    $scope.navigateToSpeakers = function () {
        $state.go("groupSpecialProduct.speakers", {product_id: $stateParams.product_id});
        $scope.$parent.mobileMenuTitle= "Speakers";
    }

}]);