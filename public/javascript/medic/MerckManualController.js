cloudAdminControllers.controller('MerckManualController', ['$scope', '$rootScope', '$sce', '$modalInstance', '$resource','$timeout', function($scope, $rootScope, $sce, $modalInstance, $resource,$timeout) {
    $scope.pdfUrl="/merckManual";

    $scope.closeModal = function(){
        var $body = angular.element(document.body);
        //$body.css("overflow", "auto");
        //$body.width("100%");
        //angular.element('.navbar').width("50%");
        //angular.element('#footer').width("100%");
        $modalInstance.close();
        $timeout(function(){
            $body.css("overflow-y", "auto");
        },100);
    }
}]);