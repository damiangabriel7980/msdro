cloudAdminControllers.controller('MerckManualController', ['$scope', '$rootScope', '$sce', '$modalInstance', '$resource', function($scope, $rootScope, $sce, $modalInstance, $resource) {
    $scope.pdfUrl="MERCK 88 Simptome - interior 130x193 - tipar 2014 (1).pdf";

    $scope.closeModal = function(){
        $modalInstance.close();
    }
}]);