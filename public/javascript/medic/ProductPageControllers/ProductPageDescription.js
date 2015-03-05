controllers.controller('ProductPageDescription', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce){
    $scope.oneAtATime = true;
    specialProductService.getSpecialProduct.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        if(result._id)
            $scope.specialProduct=result;
        else
            $state.go('home');
    });
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