/**
 * Created by miricaandrei23 on 21.11.2014.
 */
cloudAdminControllers.controller('FarmacovigilentaCtrl', ['$scope', '$rootScope', '$sce', '$modalInstance', '$resource', function($scope, $rootScope, $sce, $modalInstance, $resource) {
    $scope.pdfUrl="https://s3-eu-west-1.amazonaws.com/msdapp/resources/files/raportare-reactii-adverse.pdf";

    $scope.closeModal = function(){
        var $body = angular.element(document.body);
        $body.css("overflow", "auto");
        $body.width("100%");
        angular.element('.navbar').width("50%");
        angular.element('#footer').width("100%");
        $modalInstance.close();
    }
}]);