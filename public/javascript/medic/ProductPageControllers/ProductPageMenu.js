controllers.controller('ProductPageMenu', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce){

    specialProductService.getSpecialProductDescription.query({id:$stateParams.childId?$stateParams.childId:$stateParams.menuId}).$promise.then(function(resp){
        $scope.specialProductDescription = resp;
    });
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.printPage=function(){
        window.print();
    };
}]);