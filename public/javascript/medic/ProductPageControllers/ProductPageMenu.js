controllers.controller('ProductPageMenu', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', '$timeout', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce, $timeout){

    console.log("==============================");
    console.log($stateParams);

    var loadData = function () {
        if($scope.$parent){
            if(!$scope.$parent.specialProductPage || !$scope.$parent.specialProductMenu){
                $timeout(loadData, 300);
            }else{
                if(!$stateParams.childId && !$stateParams.menuId){
                    $scope.selectFirstMenuItem();
                }else{
                    specialProductService.getSpecialProductDescription.query({id:$stateParams.childId?$stateParams.childId:$stateParams.menuId}).$promise.then(function(resp){
                        $scope.specialProductDescription = resp;
                    });
                }
            }
        }else{
            $timeout(loadData, 300);
        }
    };

    loadData();


    $scope.trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    $scope.printPage=function(){
        window.print();
    };
}]);