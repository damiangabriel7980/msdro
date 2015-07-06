controllers.controller('ProductPageMenu', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', '$timeout', 'Success', 'Error', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce, $timeout,Success,Error){
    var loadData = function () {
        if($scope.$parent){
            if(!$scope.$parent.specialProductPage || !$scope.$parent.specialProductMenu){
                $timeout(loadData, 300);
            }else{
                if(!$stateParams.childId && !$stateParams.menuId){
                    $scope.selectFirstMenuItem();
                }else{
                    specialProductService.SpecialProductDescription.query({id:$stateParams.childId?$stateParams.childId:$stateParams.menuId}).$promise.then(function(resp){
                        $scope.specialProductDescription = Success.getObject(resp);
                        $scope.$parent.mobileMenuTitle= Success.getObject(resp).title;
                    }).catch(function(err){
                        console.log(Error.getMessage(err));
                    });
                }
            }
        }else{
            $timeout(loadData, 300);
        }
    };
    loadData();
}]);