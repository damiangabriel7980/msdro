controllers.controller('ProductPage', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    $scope.oneAtATime = true; //open accordion groups one at a time

    specialProductService.getSpecialProduct.query({id: $stateParams.product_id}).$promise.then(function(result){
        if(result.success){
            $scope.specialProductPage=result.success;
        }else{
            $state.reload();
        }
    });

    specialProductService.getSpecialProductMenu.query({id:$stateParams.product_id}).$promise.then(function(resp){
        $scope.specialProductMenu = resp;
        //load first element in menu
        $scope.selectFirstMenuItem();
    });

    $scope.selectFirstMenuItem = function () {
        var menu = $scope.specialProductMenu;
        var firstParentId = menu[0]._id;
        var firstChildId = "";
        if(menu[0].children_ids){
            if(menu[0].children_ids.length>0) firstChildId = menu[0].children_ids[0]._id;
        }
        $state.go('groupSpecialProduct.menuItem', {menuId: firstParentId, childId: firstChildId});
    };

    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.printPage=function(){
        window.print();
    };
    $scope.status = {
        isFirstOpen: false
        //open: false
    };
}]);