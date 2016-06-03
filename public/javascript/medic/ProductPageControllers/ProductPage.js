app.controllerProvider.register('ProductPage', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window','PrintService', 'Success', 'Error', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window,PrintService,Success,Error){
    $scope.oneAtATime = true; //open accordion groups one at a time
    $scope.isCollapsed = {
        isFirstOpen: false
        //open: false
    };
    specialProductService.SpecialProduct.query({id: $stateParams.product_id}).$promise.then(function(result){
        $scope.specialProductPage = Success.getObject(result);
    }).catch(function(){
        $state.reload();
    });
    $scope.mobileMenuTitle="";
    $scope.goToMenuItemWithNoChildren=function(parent,event){
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
    if($state.is('groupSpecialProduct.immunologyQA'))
        $scope.mobileMenuTitle = 'Q & A';
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
        if (name === 'Q & A'){
            $scope.mobileMenuTitle=name;
            $state.go('groupSpecialProduct.immunologyQA',{product_id: $scope.specialProductPage._id});
        }
    };

    specialProductService.SpecialProductMenu.query({id:$stateParams.product_id}).$promise.then(function(resp){
        $scope.specialProductMenu = Success.getObject(resp);
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
        $state.go('groupSpecialProduct.menuItem', {product_id: $stateParams.product_id, menuId: firstParentId, childId: firstChildId}, {location: 'replace'});
    };
    $scope.status = {
        isFirstOpen: false
    };
}]);