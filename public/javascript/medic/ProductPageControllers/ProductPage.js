controllers.controller('ProductPage', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    $scope.oneAtATime = true; //open accordion groups one at a time

    specialProductService.getSpecialProduct.query({id: $stateParams.product_id}).$promise.then(function(result){
        $scope.specialProductPage=result.success;
        specialProductService.getSpecialProductMenu.query({id:$scope.specialProductPage._id}).$promise.then(function(resp){
            console.log($stateParams.product_id);
            $scope.specialProductMenu = resp;
            //load first element in menu
            var firstParentId = resp[0]._id;
            var firstChildId = "";
            if(resp[0].children_ids){
                if(resp[0].children_ids.length>0) firstChildId = resp[0].children_ids[0]._id;
            }
            $state.go('groupSpecialProduct.menuItem', {menuId: firstParentId, childId: firstChildId});
        });
    });
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