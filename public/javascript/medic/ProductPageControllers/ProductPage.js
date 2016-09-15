app.controllerProvider.register('ProductPage', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window','PrintService', 'Success', 'Utils', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window,PrintService,Success, Utils){
    $scope.oneAtATime = true; //open accordion groups one at a time
    $scope.isCollapsed = {
        isFirstOpen: false
        //open: false
    };
    specialProductService.SpecialProduct.query({id: $stateParams.product_id}).$promise.then(function(result){
        $scope.specialProductPage = Success.getObject(result);
        $scope.pathologyAssociated = $scope.specialProductPage.pathologiesID[0];
        if($scope.specialProductPage.productType === 'resource'){
            $state.params.isResource = true;
        }
    }).catch(function(){
        $state.reload();
    });
    $scope.mobileMenuTitle="";
    $scope.goToMenuItemWithNoChildren=function(parent,event){
        if(parent.children_ids.length==0){
            $state.go($state.includes('pathologyResources') ? 'pathologyResources.menuItem' : 'groupSpecialProduct.menuItem',{menuId: parent._id, childId:'', isResource: $state.params.isResource});
        }
        else
            event.stopPropagation();
    };
    $scope.goToMenuItemWithChildren=function(parent,child){
        $scope.mobileMenuTitle = child.title;
        $state.go($state.includes('pathologyResources') ? 'pathologyResources.menuItem' : 'groupSpecialProduct.menuItem',{menuId: parent._id, childId:child._id, isResource: $state.params.isResource});
    };
    if($state.is('groupSpecialProduct.files'))
        $scope.mobileMenuTitle = 'Resurse';
    if($state.is('pathologyResources.speakers'))
        $scope.mobileMenuTitle = 'Speakers';
    if($state.is('groupSpecialProduct.sitemap'))
        $scope.mobileMenuTitle = 'Sitemap';
    if($state.is('pathologyResources.immunologyQA'))
        $scope.mobileMenuTitle = 'Parerile expertilor';
    $scope.navigateMobile = function(name){
      if(name === "Resurse"){
          $scope.mobileMenuTitle=name;
          $state.go('groupSpecialProduct.files',{product_id: $scope.specialProductPage._id});
      }
        if(name === 'Speakers'){
            $scope.mobileMenuTitle=name;
            $state.go('pathologyResources.speakers',{product_id: $scope.specialProductPage._id});
        }
        if(name === 'Sitemap'){
            $scope.mobileMenuTitle=name;
            $state.go('groupSpecialProduct.sitemap',{product_id: $scope.specialProductPage._id, isResource: $state.params.isResource});
        }
        if (name === 'Q & A'){
            $scope.mobileMenuTitle=name;
            $state.go('groupSpecialProduct.immunologyQA',{product_id: $scope.specialProductPage._id, isResource: $state.params.isResource});
        }
    };

    specialProductService.SpecialProductMenu.query({id:$stateParams.product_id}).$promise.then(function(resp){
        $scope.specialProductMenu = Utils.bindAccordionToCollection(Success.getObject(resp), {open : false});
        if($state.params.menuId){
            Utils.toggleAccordionBindedToArray($scope.specialProductMenu, 'open', $state.params.menuId);
        }
    });

    $scope.selectFirstMenuItem = function () {
        var menu = $scope.specialProductMenu;
        if(menu.length){
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
            $state.go($state.includes('pathologyResources') ? 'pathologyResources.menuItem' : 'groupSpecialProduct.menuItem', {product_id: $stateParams.product_id, menuId: firstParentId, childId: firstChildId, isResource: $state.params.isResource}, {location: 'replace'});
            Utils.toggleAccordionBindedToArray($scope.specialProductMenu, 'open', firstParentId);
        } else {
            $state.go('groupSpecialProduct.immunologyQA', {product_id: $stateParams.product_id, isResource: $state.params.isResource}, {location: 'replace'});
        }

    };
    $scope.status = {
        isFirstOpen: false
    };
}]);