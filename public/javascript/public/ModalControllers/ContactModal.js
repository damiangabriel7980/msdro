controllers.controller('ContactModal', ['$scope', '$rootScope', '$modalInstance', function($scope, $rootScope, $modalInstance) {

    $scope.closeModal = function(){
        $modalInstance.close();
    }
}]);