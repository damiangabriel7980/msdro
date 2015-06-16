controllers.controller('ProductPageInfo', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce','$window', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce,$window){
    $scope.oneAtATime = true;

    $scope.printPage=function(){
        window.print();
    };
}]);