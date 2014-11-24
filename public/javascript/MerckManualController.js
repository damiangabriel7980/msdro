cloudAdminControllers.controller('MerckManualController', ['$scope', '$rootScope', '$sce', '$modalInstance', '$resource', function($scope, $rootScope, $sce, $modalInstance, $resource) {
    $scope.pdfUrl="/merckManual";

    $scope.closeModal = function(){
        $modalInstance.close();
    }
}]);