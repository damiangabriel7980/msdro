/**
 * Created by miricaandrei23 on 21.11.2014.
 */
cloudAdminControllers.controller('TermsCtrl', ['$scope', '$rootScope', '$sce', '$modalInstance', '$resource','$timeout', function($scope, $rootScope, $sce, $modalInstance, $resource,$timeout) {
    $scope.pdfUrl="https://s3-eu-west-1.amazonaws.com/msdapp/resources/files/terms+%26+conditions.pdf";

    $scope.closeModal = function(){
        $modalInstance.close();
        var $body = angular.element(document.body);
        $body.width("100%");
        angular.element('.navbar').width("50%");
        angular.element('#footer').width("100%");
        //$timeout(function(){
            $body.css("overflow-y", "auto");
        //},100);
    }
}]);