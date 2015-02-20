/**
 * Created by miricaandrei23 on 21.11.2014.
 */
controllers.controller('Terms', ['$scope', '$rootScope', '$sce', '$modalInstance', '$resource','$timeout', function($scope, $rootScope, $sce, $modalInstance, $resource,$timeout) {
    $scope.pdfUrl="https://s3-eu-west-1.amazonaws.com/msdapp/resources/files/terms+%26+conditions.pdf";

    $scope.closeModal = function(){
        $modalInstance.close();
    }
}]);