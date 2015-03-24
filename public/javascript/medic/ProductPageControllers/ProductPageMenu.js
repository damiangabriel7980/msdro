controllers.controller('ProductPageMenu', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', '$timeout', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce, $timeout){

    var loadData = function () {
        if(!$scope.$parent.specialProductPage){
            $timeout(loadData, 300);
        }else{
            specialProductService.getSpecialProductDescription.query({id:$stateParams.childId?$stateParams.childId:$stateParams.menuId}).$promise.then(function(resp){
                $scope.specialProductDescription = resp;
            });
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