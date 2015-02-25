controllers.controller('ProductPage', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    $scope.oneAtATime = true;
    $scope.activeItem = null;
    specialProductService.getSpecialProduct.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        console.log(result);
        if(result._id)
        {
            $scope.specialProductPage=result;
            specialProductService.getSpecialProductMenu.query({id:$scope.specialProductPage._id}).$promise.then(function(resp){
                console.log($stateParams.product_id);
                $scope.specialProductMenu = resp;
            });
        }
        else
            $state.go('home');
    });
    $scope.activeItem=null;
    $scope.changeItem=function(id){
        //if($scope.activeItem==id)
        $scope.activeItem=id;
    };
    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.printPage=function(){
        window.print();
    };
    $scope.statusMainMenu = {
        isFirstOpen: false
    };
    $scope.status = {
        isFirstOpen: false
        //open: false
    };
}]);