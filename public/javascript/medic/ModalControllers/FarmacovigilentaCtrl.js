/**
 * Created by miricaandrei23 on 21.11.2014.
 */
controllers.controller('FarmacovigilentaCtrl', ['$scope', '$rootScope', '$sce', '$modalInstance', '$resource','$timeout', function($scope, $rootScope, $sce, $modalInstance, $resource,$timeout) {
    $scope.pdfUrl="https://s3-eu-west-1.amazonaws.com/msdapp/resources/files/raportare-reactii-adverse.pdf";
    $scope.closeModal = function(){
        $modalInstance.close();
    }
}]);