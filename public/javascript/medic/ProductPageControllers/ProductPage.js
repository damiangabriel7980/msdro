controllers.controller('ProductPage', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    $scope.oneAtATime = true; //open accordion groups one at a time

    specialProductService.getSpecialProduct.query({id: $stateParams.product_id}).$promise.then(function(result){
        $scope.specialProductPage=result.success;
        specialProductService.getSpecialProductMenu.query({id:$scope.specialProductPage._id}).$promise.then(function(resp){
            $scope.specialProductMenu = resp;
            //load first element in menu
            $scope.firstParentId = resp[0]._id;
            $scope.firstChildId = "";
            if(resp[0].children_ids){
                if(resp[0].children_ids.length>0) $scope.firstChildId = resp[0].children_ids[0]._id;
            }
            $state.go('groupSpecialProduct.menuItem', {menuId: $scope.firstParentId, childId: $scope.firstChildId});
            for(var i=0;i<$scope.specialProductMenu.length;i++)
            {
                if($scope.specialProductMenu[i].title=='Acasa'||$scope.specialProductMenu[i].title=='Acasă')
                {
                    $scope.homeID=$scope.specialProductMenu[i]._id;
                    break;
                }
            }
        });
    });
    $scope.goHome=function(parentID){
        $state.go('groupSpecialProduct.menuItem', {menuId: parentID, childId: ''});
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