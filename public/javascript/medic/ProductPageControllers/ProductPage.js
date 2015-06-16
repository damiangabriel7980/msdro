controllers.controller('ProductPage', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window','PrintService', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window,PrintService){
    $scope.oneAtATime = true; //open accordion groups one at a time
    $scope.isCollapsed = {
        isFirstOpen: false
        //open: false
    };
    specialProductService.getSpecialProduct.query({id: $stateParams.product_id}).$promise.then(function(result){
        if(result.success){
            $scope.specialProductPage=result.success;
        }else{
            $state.reload();
        }
    });
    $scope.mobileMenuTitle="";
    $scope.goToMenuItemWithNoChildren=function(parent,event){
        //$scope.mobileMenuTitle = parent.title;
        if(parent.children_ids.length==0)
            $state.go('groupSpecialProduct.menuItem',{menuId: parent._id, childId:''});
        else
            event.stopPropagation();
    };
    $scope.goToMenuItemWithChildren=function(parent,child){
        $scope.mobileMenuTitle = child.title;
        $state.go('groupSpecialProduct.menuItem',{menuId: parent._id, childId:child._id});
    };
    if($state.is('groupSpecialProduct.files'))
        $scope.mobileMenuTitle = 'Resurse';
    if($state.is('groupSpecialProduct.speakers'))
        $scope.mobileMenuTitle = 'Speakers';
    if($state.is('groupSpecialProduct.sitemap'))
        $scope.mobileMenuTitle = 'Sitemap';

    $scope.navigateMobile = function(name){
      if(name === "Resurse"){
          $scope.mobileMenuTitle=name;
          $state.go('groupSpecialProduct.files',{product_id: $scope.specialProductPage._id});
      }
        if(name === 'Speakers'){
            $scope.mobileMenuTitle=name;
            $state.go('groupSpecialProduct.speakers',{product_id: $scope.specialProductPage._id});
        }
        if(name === 'Sitemap'){
            $scope.mobileMenuTitle=name;
            $state.go('groupSpecialProduct.sitemap',{product_id: $scope.specialProductPage._id});
        }
    };

    specialProductService.getSpecialProductMenu.query({id:$stateParams.product_id}).$promise.then(function(resp){
        $scope.specialProductMenu = resp;
    });

    $scope.selectFirstMenuItem = function () {
        var menu = $scope.specialProductMenu;
        var firstParentId = menu[0]._id;
        var firstChildId = "";
        if(menu[0].children_ids){
            if(menu[0].children_ids.length>0){
                $scope.mobileMenuTitle = menu[0].children_ids[0].title;
                firstChildId = menu[0].children_ids[0]._id;
            }
               else
                $scope.mobileMenuTitle = menu[0].title;
        }
        $state.go('groupSpecialProduct.menuItem', {product_id: $stateParams.product_id, menuId: firstParentId, childId: firstChildId});
    };
    $scope.status = {
        isFirstOpen: false
        //open: false
    };
}]);