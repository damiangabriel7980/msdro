/**
 * Created by miricaandrei23 on 13.02.2015.
 */
controllers.controller('ProductPagePrescription', ['$scope', '$rootScope', '$stateParams', 'specialProductService', '$state','$sce', function($scope, $rootScope, $stateParams, specialProductService, $state,$sce){

    $scope.printPage=function(){
        window.print();
    };
}]);
