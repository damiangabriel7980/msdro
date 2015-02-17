cloudAdminControllers.controller('specialProductCtrl', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    $scope.oneAtATime = true;
    specialProductService.getSpecialProduct.query({specialGroupSelected: $rootScope.specialGroupSelected?$rootScope.specialGroupSelected._id.toString():null}).$promise.then(function(result){
        if(result._id)
            $scope.specialProductPage=result;
        else
            $state.go('home');
    });
    console.log($stateParams);
    specialProductService.getSpecialProductMenu.query({id:$stateParams.product_id}).$promise.then(function(resp){
       $scope.specialProductMenu = resp;
    });
    $scope.checkHasChildren = function(item){
          if(item.children_ids.length==0)
            $scope.statusMainMenu.isFirstOpen=false;
        else
              $scope.statusMainMenu.isFirstOpen=true;
    };
    $scope.removePanelBody = function(){
            $('.panel-collapse').collapse("hide");
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
        isFirstOpen: false,
        isFirstDisabled: false
    };
}]);